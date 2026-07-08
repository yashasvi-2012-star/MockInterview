import os
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv('MONGODB_URI')
print('MONGO URI present:', bool(uri))
try:
    client = MongoClient(uri, serverSelectionTimeoutMS=3000, connectTimeoutMS=3000)
    print('Attempting ping...')
    client.admin.command('ping')
    print('Ping succeeded')
except ServerSelectionTimeoutError as e:
    print('ServerSelectionTimeoutError:', e)
except Exception as e:
    print('Other exception:', e)
