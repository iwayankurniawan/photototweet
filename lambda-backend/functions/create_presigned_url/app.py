import boto3
from boto3.dynamodb.conditions import Key, Attr
import time
import json
import os
import traceback

def lambda_handler(event, context):
    try:
        event_body = json.loads(event["body"])
        s3 = boto3.client('s3')

        # Generate a random S3 key name
        new_filename = event_body["uniqueId"]+"/"+event_body["filename"]
        final_filename = new_filename.replace(" ", "-")
        # Generate the presigned URL for put requests
        
        presigned_url = s3.generate_presigned_post(
            Bucket= os.environ["S3_STORAGE"],
            Key=final_filename,
            ExpiresIn=60,
        )
        
        print(presigned_url)
        # Return the presigned URL
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            "body": json.dumps({
                "presigned": presigned_url,
                "filename": final_filename
            })
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
    