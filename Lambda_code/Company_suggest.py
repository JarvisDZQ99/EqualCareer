import json
import pymysql
import os
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_secret():
    secret_name = os.environ.get("secret_name")
    region_name = os.environ.get("region_name")
    
    if not secret_name or not region_name:
        raise ValueError("Missing secret_name or region_name environment variables")

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        logger.error(f"Failed to retrieve secret: {str(e)}")
        raise e

    if 'SecretString' in get_secret_value_response:
        secret = get_secret_value_response['SecretString']
    else:
        secret = json.loads(get_secret_value_response['SecretBinary'])
    
    return json.loads(secret)

def lambda_handler(event, context):
    db_host = os.environ.get('db_host')
    if not db_host:
        logger.error("Missing db_host environment variable")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Incomplete database configuration'})
        }

    try:
        secret = get_secret()
        db_username = secret['username']
        db_password = secret['password']
    except Exception as e:
        logger.error(f"Failed to retrieve database credentials: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to retrieve database credentials'})
        }

    try:
        connection = pymysql.connect(
            host=db_host,
            user=db_username,
            password=db_password,
            database='paygap_db',
            cursorclass=pymysql.cursors.DictCursor
        )
        logger.info(f"Successfully connected to database {db_host}")
    except pymysql.MySQLError as e:
        logger.error(f"Database connection failed: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f"Database connection failed: {str(e)}"})
        }

    try:
        with connection.cursor() as cursor:
            params = event.get('queryStringParameters', {})
            state = params.get('state')

            logger.info(f"Received state parameter: {state}")

            query = """
                SELECT primary_abn, primary_employer_name, primary_division_name, 
                       primary_subdivision_name, primary_group_name, primary_class_name,
                       primary_abn_score, State, `Action on gender equality`, 
                       `Employee support`, `Flexible work`, `Workplace overview`
                FROM companies 
                WHERE LOWER(State) = LOWER(%s)
                ORDER BY primary_abn_score DESC
            """
            
            logger.info(f"Executing query: {query}")
            logger.info(f"Query parameter: {state}")

            cursor.execute(query, (state,))
            result = cursor.fetchall()

            logger.info(f"Query result: {result}")

            return {
                'statusCode': 200,
                'body': json.dumps(result),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                }
            }
    
    except Exception as e:
        logger.error(f"Error during query execution: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    
    finally:
        connection.close()
