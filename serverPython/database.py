from pymongo import MongoClient

class UserDAO :
    def __init__(self, url, database_name, collection_name) :
        try :
            self.client = MongoClient(url)
        except OSError or ValueError or Exception as e :
            print(f"database connect error {e}")
        self.db = self.client[database_name]
        self.collection = self.db[collection_name]