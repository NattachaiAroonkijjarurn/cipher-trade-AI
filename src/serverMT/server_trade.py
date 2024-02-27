import time
from database import collection_accountMT
from position import task_position
from prediction import task_prediction

def process():
    accounts_mt = list(collection_accountMT.find())
    
    for account_mt in accounts_mt:
        try:
            task_position(account_mt)
            task_prediction()
        except Exception as e:
            print("An error occurred:", e)
            
if __name__ == "__main__":
    while True:
        process()