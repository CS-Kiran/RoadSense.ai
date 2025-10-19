from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_USERNAME = os.environ.get("DBUSER")
POSTGRES_PASSWORD = os.environ.get("DBPASS")
POSTGRES_HOST = os.environ.get("DBHOST")
POSTGRES_DATABASE = os.environ.get("DBNAME")
POSTGRES_PORT = os.environ.get("DBPORT", 5432)

DATABASE_URL = f"postgresql://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DATABASE}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
