import dotenv
import os
import psycopg

def connect():
    dotenv.load_dotenv()
    return psycopg.connect(f'dbname={os.getenv("DB_NAME")} user={os.getenv("DB_USER")} password={os.getenv("DB_PASSWORD")} host={os.getenv("DB_HOST")} port={os.getenv("DB_PORT")}')


def connect_aws():
    dotenv.load_dotenv()
    return psycopg.connect(f'dbname={os.getenv("RDS_NAME")} user={os.getenv("RDS_USER")} password={os.getenv("RDS_PASSWORD")} host={os.getenv("RDS_HOST")} port={os.getenv("RDS_PORT")}')
