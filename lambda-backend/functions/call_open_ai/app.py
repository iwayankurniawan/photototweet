import uuid
import boto3
from boto3.dynamodb.conditions import Key, Attr
import time
import json
import os
from openai import OpenAI
import base64
import traceback


def lambda_handler(event, context):
    try:
        print(event)
        secret = get_secret()
        # Setup openai client
        secret_val = json.loads(secret)
        openai_client = OpenAI(api_key=secret_val["OPEN_AI_KEY"])

        # setup s3 client
        s3 = boto3.client('s3')
        bucket_name = os.environ["S3_STORAGE"]

        # get information from user
        event_body = json.loads(event["body"])
        filename = event_body["filename"]

        # Main Function start in here
        base64_image = get_s3_image_as_base64(s3, bucket_name, filename)
        result_vision = openai_vision(openai_client, base64_image)
        result = openai_gpt(openai_client, result_vision)

        client = boto3.resource("dynamodb")
        image_table = client.Table(os.environ["DYNAMODB_IMAGE_TABLE"])
        image_table.put_item(Item={
            'id': "test12",
            'filename': filename,  # Example numeric attribute
            # Add other attributes as needed
        })

        # Return chat completion url
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            "body": json.dumps({"result": result}),
        }
    except Exception as error:
        print(error)
        traceback.print_exc()
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            "body": json.dumps("Error in the server"),
        }


def openai_vision(client, base64_image):
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What’s in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "low"
                        },
                    },
                ],
            }
        ],
        max_tokens=100,
    )
    return response.choices[0].message.content


def openai_gpt(client, question):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Generate 5 tweet option for this context: "+question},
        ],
    )
    return response.choices[0].message.content


def get_s3_image_as_base64(s3, bucket_name, key):
    try:
        # Download the image from S3
        response = s3.get_object(Bucket=bucket_name, Key=key)
        image_data = response['Body'].read()

        # Convert the image to base64
        base64_image = base64.b64encode(image_data).decode('utf-8')

        return base64_image

    except Exception as e:
        print(f"Error: {e}")
        return None


def get_secret():
    # Create a Secrets Manager client
    session = boto3.session.Session()
    secret_name = "OPENAI_API_KEY"
    region_name = "us-west-1"
    aws_client = session.client(
        service_name='secretsmanager', region_name=region_name)
    try:
        get_secret_value_response = aws_client.get_secret_value(
            SecretId=secret_name
        )
    except Exception as e:
        raise e
    secret = get_secret_value_response['SecretString']
    return secret
