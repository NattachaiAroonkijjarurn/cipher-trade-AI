from pymongo import MongoClient
from config import mongo_url
import os

client = MongoClient(mongo_url)
db = client['CipherTrade']

# Collections
collection_predict = db['predictions']
collection_accountMT = db['account_metaTrade']
collection_position = db['positions']
collection_models = db['models']
collection_order = db['orders']
collection_bot = db['bots']