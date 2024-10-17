import json
import pymysql
import os
import boto3
import logging
from botocore.exceptions import ClientError
from decimal import Decimal

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Custom JSON encoder to handle Decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

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
    connection = None
    try:
        # Retrieve database connection info
        db_host = os.environ.get('db_host')
        if not db_host:
            raise ValueError("Missing db_host environment variable")

        secret = get_secret()
        db_username = secret['username']
        db_password = secret['password']

        industry = event.get('queryStringParameters', {}).get('industry', '')
        occupation = event.get('queryStringParameters', {}).get('occupation', '')

        if not industry and not occupation:
            raise ValueError("Industry or Occupation must be provided in the query parameters")

        logger.info(f"Querying for industry: {industry}, occupation: {occupation}")

        # Connect to the database
        connection = pymysql.connect(
            host=db_host,
            user=db_username,
            password=db_password,
            database='paygap_db',
            cursorclass=pymysql.cursors.DictCursor
        )
        logger.info(f"Successfully connected to database at {db_host}")

        with connection.cursor() as cursor:
            # Combine both tables using JOIN on occupation
            query = """
            SELECT io.industry, io.occupation, io.top_10_female, 
                   ot.specialist_task, ot.percent_time_spent_on_task, ot.emerging_trending_flag, 
                   ot.specialist_cluster, ot.percent_time_spent_on_cluster, ot.skills_statement, ot.question
            FROM industry_occupation io
            JOIN occupation_task ot ON LOWER(TRIM(io.occupation)) = LOWER(TRIM(ot.occupation))
            WHERE LOWER(TRIM(io.industry)) = LOWER(TRIM(%s))
            AND LOWER(TRIM(io.occupation)) = LOWER(TRIM(%s))
            """
            cursor.execute(query, (industry, occupation))
            result = cursor.fetchall()

            if not result:
                logger.warning(f"No data found for industry: {industry}, occupation: {occupation}")
                return {
                    'statusCode': 404,
                    'body': json.dumps({"error": f"No data found for industry: {industry}, occupation: {occupation}"})
                }

            processed_data = [
                {key: row[key] for key in row} 
                for row in result
            ]

            return {
                'statusCode': 200,
                'body': json.dumps(processed_data, cls=DecimalEncoder),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                }
            }
    
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps({"error": str(e)})
        }
    
    except pymysql.MySQLError as e:
        logger.error(f"Database error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"error": "Database error occurred"})
        }
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"error": "An unexpected error occurred"})
        }
    
    finally:
        if connection:
            connection.close()
            logger.info("Database connection closed")