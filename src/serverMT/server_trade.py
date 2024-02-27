import time
from database import collection_accountMT
from position import task_position
from prediction import task_prediction

def process():
    accounts_mt = list(collection_accountMT.find())
    
    # try:
    for account_mt in accounts_mt:
        task_position(account_mt)
    task_prediction()
    # except Exception as e:
    #     print("An error occurred server trade :", e)
    
            
if __name__ == "__main__":
    while True:
        process()