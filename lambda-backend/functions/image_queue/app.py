import uuid
import boto3
import time
import json
import os
from datetime import datetime
import base64
import traceback


def lambda_handler(event, context):
    try:
        # get information from user
        event_body = json.loads(event["body"])
        filenames = event_body["filename"]
        user_id = event_body["uniqueId"]

        msg = []
        
        for filename in filenames:
            response = updateSqs(user_id, filename)
            msg.append(f"Message sent to SQS with MessageId: {response['MessageId']}")
            updateDynamoDb(user_id, filename)
        
        updateDynamoDbCredits(num_images=len(filenames), user_id=user_id)

        # Return chat completion url
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            "body": json.dumps({"result": msg}),
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


def updateDynamoDb(user_id, filename):
    client = boto3.resource("dynamodb")
    image_table = client.Table(os.environ["DYNAMODB_IMAGE_TABLE"])
    timestamp = datetime.utcnow().isoformat()
    image_table.put_item(Item={
        'id': "USER#" + user_id,
        'user_id': user_id,
        'filename': filename,  
        'datetime': timestamp,
        'status': "Image Uploaded"
        # Add other attributes as needed
    })

def updateSqs(user_id, filename):
    # Retrieve SQS queue URL from environment variable
    sqs_queue_url = os.environ['SQS_QUEUE_URL']
    # Message payload
    message_body = {'filename': filename, 'uniqueId':user_id, "hello":"hello"}
    # Convert to JSON
    message_body_json = json.dumps(message_body)
    # Create SQS client
    sqs = boto3.client('sqs')
    # Send message to SQS queue
    response = sqs.send_message(
        QueueUrl=sqs_queue_url,
        MessageBody=message_body_json
    )
    return response

def updateDynamoDbCredits(num_images, user_id):
    # Create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')

    # Specify the table name
    table_name = os.environ["NEXT_AUTH_TABLE"]

    # Specify the key of the item you want to update
    item_key = {'pk': "USER#" + user_id, 'sk' : "USER#" + user_id}

    # Specify the attribute you want to update (e.g., 'credits')
    attribute_to_update = 'credits'

    # Specify the increment value
    increment_value = num_images

    # Create the DynamoDB table resource
    table = dynamodb.Table(table_name)

    # Update the item using the UpdateItem operation
    response = table.update_item(
        Key=item_key,
        UpdateExpression=f"SET {attribute_to_update} = {attribute_to_update} - :incr",
        ExpressionAttributeValues={
            ':incr': increment_value
        },
        ReturnValues='UPDATED_NEW'
    )

    # Print the updated item
    print("Updated Item:", response['Attributes'])
