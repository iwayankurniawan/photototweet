import uuid
import boto3
from boto3.dynamodb.conditions import Key, Attr
import time
import json
import os
from openai import OpenAI
from datetime import datetime
import base64
import traceback


def lambda_handler(event, context):
    try:
        secret = get_secret()
        # Setup openai client
        secret_val = json.loads(secret)
        openai_client = OpenAI(api_key=secret_val["OPEN_AI_KEY"])

        # setup s3 client
        s3 = boto3.client('s3')
        bucket_name = os.environ["S3_STORAGE"]

        for record in event['Records']:
            # get information from user
            event_body = json.loads(record['body'])
            filename = event_body["filename"]
            user_id = event_body["uniqueId"]
            s3_folder = user_id + "/" + filename

            # Main Function start in here
            base64_image = get_s3_image_as_base64(s3, bucket_name, s3_folder)
            result_vision = openai_vision(openai_client, base64_image)
            result = openai_gpt(openai_client, result_vision)

            client = boto3.resource("dynamodb")
            image_table = client.Table(os.environ["DYNAMODB_IMAGE_TABLE"])
            timestamp = datetime.utcnow().isoformat()
            image_table.put_item(Item={
                'id': "USER#" + user_id,
                'user_id': user_id,
                'filename': filename,  
                'datetime': timestamp,
                'result': result,
                'status': "Image Done"
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
        client = boto3.resource("dynamodb")
        image_table = client.Table(os.environ["DYNAMODB_IMAGE_TABLE"])
        timestamp = datetime.utcnow().isoformat()
        image_table.put_item(Item={
            'id': "USER#" + user_id,
            'user_id': user_id,
            'filename': filename,  
            'datetime': timestamp,
            'status': "Image Failed"
            # Add other attributes as needed
        })
        #Update the credits, so it return to correct value
        updateDynamoDbCredits(user_id)
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

def updateDynamoDbCredits(user_id):
    # Create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')

    # Specify the table name
    table_name = os.environ["NEXT_AUTH_TABLE"]

    # Specify the key of the item you want to update
    item_key = {'pk': "USER#" + user_id, 'sk' : "USER#" + user_id}

    # Specify the attribute you want to update (e.g., 'credits')
    attribute_to_update = 'credits'

    response = table.get_item(Key=item_key)
    current_value = response.get('Item', {}).get('credits', 0)
    print("current_value "+response)
    # Specify the increment value
    increment_value = 1

    # Create the DynamoDB table resource
    table = dynamodb.Table(table_name)

    # Update the item using the UpdateItem operation
    response = table.update_item(
        Key=item_key,
        UpdateExpression=f"SET {attribute_to_update} = :new_value",
        condition_expression = f"{attribute_to_update} = :expected_value",
        ExpressionAttributeValues={
            ':new_value': current_value + increment_value,
            ':expected_value': current_value,
        },
        ReturnValues='UPDATED_NEW'
    )

    # Print the updated item
    print("Updated Item:", response['Attributes'])
