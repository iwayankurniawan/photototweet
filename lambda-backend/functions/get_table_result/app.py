import boto3
from boto3.dynamodb.conditions import Key, Attr
import time
import json
import os
import traceback
import uuid


def lambda_handler(event, context):
    try:
        event_body = json.loads(event["body"])

        # Specify your DynamoDB table name
        table_name = os.environ["DYNAMODB_IMAGE_TABLE"]

        partition_key_value = "USER#"+event_body["uniqueId"]
        
        if event_body["filename"]:
            sort_key_value = event_body["filename"]
        else:
            sort_key_value = None
        
        result,LastEvaluatedKey = query_dynamodb_with_paging(
            table_name=table_name, partition_key_value=partition_key_value, sort_key_value=sort_key_value)
        
        for item in result:
            item["url"] = create_presigned(item["user_id"]+"/"+item["filename"])
            item["LastEvaluatedKey"] = LastEvaluatedKey
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            "body": json.dumps({"result": result}),
        }

    except Exception as error:
        traceback.print_exc()
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            "body": json.dumps(str(error))
        }


def query_dynamodb_with_paging(table_name, partition_key_value, sort_key_value=None, page_size=3):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    if sort_key_value:
        exclusive_start_key = {
            'id': partition_key_value,
            'filename': sort_key_value,
        }
        # Use the query operation to get items based on the partition key and sort key
        response = table.query(
            KeyConditionExpression='#partition_key = :partition_value',
            ExpressionAttributeNames={
                '#partition_key': 'id',
            },
            ExpressionAttributeValues={
                ':partition_value': partition_key_value,
            },
            Limit=page_size,
            ExclusiveStartKey=exclusive_start_key
        )
    else:
        
        # Use the query operation to get items based on the partition key and sort key
        response = table.query(
            KeyConditionExpression='#partition_key = :partition_value',
            ExpressionAttributeNames={
                '#partition_key': 'id',
            },
            ExpressionAttributeValues={
                ':partition_value': partition_key_value,
            },
            Limit=page_size
        )
    print(response)
    # Display the items
    items = response.get('Items', [])
    if 'LastEvaluatedKey' in response:
        LastEvaluatedKey = True
    else:
        LastEvaluatedKey = False
    return items, LastEvaluatedKey


def create_presigned(filename):
    bucket_name = os.environ["S3_STORAGE"]

    # Create an S3 client
    s3 = boto3.client('s3')

    # Generate a presigned URL for the file
    presigned_url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket_name, 'Key': filename},
        ExpiresIn=3600  # URL expires in 1 hour (3600 seconds)
    )

    return presigned_url
