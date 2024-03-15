from prediction import task_prediction

def process():
    try:
        task_prediction()
    except Exception as e:
        print("An error occurred server prediction :", e)
    
if __name__ == "__main__":
    while True:
        process()