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

        # Connect to the database
        connection = pymysql.connect(
            host=db_host,
            user=db_username,
            password=db_password,
            database='employmentratio_db',
            cursorclass=pymysql.cursors.DictCursor
        )
        logger.info(f"Successfully connected to database at {db_host}")

        with connection.cursor() as cursor:
            # Query to get gender employment ratio data
            query = """
            SELECT 
                primary_division_name, 
                SUM(Men) as Men, 
                SUM(Women) as Women, 
                SUM(difference) as difference, 
                SUM(total_employees) as total_employees,
                AVG(gap_ratio) as gap_ratio
            FROM employmentratio
            GROUP BY primary_division_name
            """
            cursor.execute(query)
            result = cursor.fetchall()
            
            # Process the data
            processed_data = [
                {
                    "industry": row['primary_division_name'],
                    "men": int(row['Men']) if row['Men'] is not None else 0,
                    "women": int(row['Women']) if row['Women'] is not None else 0,
                    "difference": float(row['difference']) if row['difference'] is not None else 0,
                    "total_employees": int(row['total_employees']) if row['total_employees'] is not None else 0,
                    "gap_ratio": float(row['gap_ratio']) if row['gap_ratio'] is not None else 0.0
                }
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
        logger.err