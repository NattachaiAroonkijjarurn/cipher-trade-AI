import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
load_dotenv()

url_mongo = os.environ.get('mongourl')

try:
    client = MongoClient(url_mongo)
    print("MongoDB connection successful.")
except ConnectionFailure:
    print("Failed to connect to MongoDB. Check your connection URL and internet connection.")
    exit()
    
# Select your database
db = client['CipherTrade']

# Select your collection
collection = db['positions']

# Define your query
query = {"id": 0}

# Execute the query
result = collection.find_one(query)

# Print the result
print(result)
