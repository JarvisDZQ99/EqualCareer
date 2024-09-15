import pymysql
import json
import boto3
import base64
import os
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Extract db_name and query from the event object
    db_name = event.get('db_name')
    query = event.get('query')
    
    if not db_name or not query:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'db_name and query parameters are required'})
        }

    # Fetch the database credentials from Secrets Manager
    secret = get_secret()
    db_host = os.environ["db_host"]
    db_user = secret['username']
    db_password = secret['password']

    # Establish a database connection
    connection = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name
    )
    
    try:
        with connection.cursor() as cursor:
            # Execute the query
            cursor.execute(query)
            
            # Fetch all the rows
            result = cursor.fetchall()
        
        # Return the result as a JSON object
        return {
            'statusCode': 200,
            'body': json.dumps(result, default=str)  # Default=str to handle non-serializable objects like datetime
        }
        
    except pymysql.MySQLError as e:
        # Return the error message
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        # Close the database connection
        connection.close()

def get_secret():
    secret_name = os.environ["secret_name"]
    region_name = os.environ["region_name"]

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name,
        endpoint_url=os.environ["sm_endpoint_url"]
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e

    # Decrypts secret using the associated KMS key.
    if 'SecretString' in get_secret_value_response:
        secret = get_secret_value_response['SecretString']
    else:
        secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return json.loads(secret)
