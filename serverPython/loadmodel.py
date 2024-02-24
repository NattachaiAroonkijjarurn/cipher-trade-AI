import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential, load_model
from keras.layers import LSTM, Dropout, Dense, LeakyReLU, BatchNormalization
from keras.regularizers import l2
from keras.optimizers import Adam
from keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, LearningRateScheduler
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc
from sklearn.metrics import precision_recall_curve, f1_score, auc
from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score, roc_auc_score
import joblib
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

timestamp = int(datetime.now().timestamp())

# Get the current date
now = datetime.now()

# Format the version string based on the current date
# Assuming the version format is "major_version.YEAR.MONTH.DAY"
version = f"1.0.{now.year % 100}.{now.month}.{now.day}"
load_dotenv()

url_mongo = os.environ.get('mongourl')

client = MongoClient(url_mongo)
db = client['CipherTrade']
collection = db['models']


Curency = ['EURUSD', 'USDJPY', 'GBPUSD', 'AUDUSD', 'USDCHF', 'USDCAD']
textTime = ['5m', '15m', '30m', '1h', '2h', '4h']
Path = ['modelBuy', 'modelSell']
pathScaler = ['scalerBuy', 'scalerSell']
State = ['buy', 'sell']

stoploss = [0.00050, 0.00100, 0.00250, 0.00400, 0.00500, 0.0600]


for i in range(len(Path)) :
    for currency in Curency :
        for time in textTime :
            #load data model scale
            df = pd.read_csv(f'{State[i]}Data/{State[i]}_{currency}{time}.csv')
            model = load_model(f'{Path[i]}/{State[i]}_{currency}{time}.h5')
            scaler = joblib.load(f'{pathScaler[i]}/scaler_{currency}{time}.joblib')
            # Preprocess the data
            df['result'] = df['result'].replace({'win': 1, 'loss': 0})
            df = df.drop(columns=['time', 'open', 'high', 'low', 'close', 'tick_volume', 'spread', 'real_volume', 'EMA50', 'EMA200', 'cross'])
            df = df.astype('float32')
            
            # Filter rows with 'win' label for x_test
            x_test_win = df[df['result'] == 1].tail(40)
            y_test_win = x_test_win['result']

            # Filter rows with 'loss' label for x_test
            x_test_loss = df[df['result'] == 0].tail(60)
            y_test_loss = x_test_loss['result']

            # Concatenate the win and loss test sets
            x_test = pd.concat([x_test_win, x_test_loss])
            y_test = pd.concat([y_test_win, y_test_loss])
            x_test = x_test.drop(columns=['result'])

            # Drop the rows used for testing from the original DataFrame
            df = df.drop(index=x_test.index)

            x = df.drop(columns=['result'])
            y = df['result']

            # Split the data into training and testing sets
            x_train = x
            y_train = y
            
            x_train_scaled = scaler.transform(x_train)
            x_train_reshaped = np.reshape(x_train_scaled, (x_train_scaled.shape[0], 1, x_train_scaled.shape[1]))

            x_test_scaled = scaler.transform(x_test)
            x_test_reshaped = np.reshape(x_test_scaled, (x_test_scaled.shape[0], 1, x_test_scaled.shape[1]))
            
            #  predict
            y_pred_test = model.predict(x_test_reshaped)
            y_pred_train = model.predict(x_train_reshaped)
            
            fpr, tpr, thresholds = roc_curve(y_test, y_pred_test)
            best_threshold = thresholds[np.argmax(tpr - fpr)]
            
            ## test....
            y_predict_test = np.squeeze(y_pred_test )
            y_binary_test = (y_predict_test >= best_threshold).astype(int)
            
            # Calculating metrics
            accuracy_test = accuracy_score(y_test, y_binary_test)
            recall_test = recall_score(y_test, y_binary_test)
            precision_test = precision_score(y_test, y_binary_test)
            f1_test = f1_score(y_test, y_binary_test)
            auc_test = roc_auc_score(y_test, y_binary_test)

            test_win_correct = np.sum(y_test[y_test == 1] == (y_binary_test[y_test == 1]))
            test_win_wrong = np.sum(y_test[y_test == 1] != (y_binary_test[y_test == 1]))

            test_loss_correct = np.sum(y_test[y_test == 0] == (y_binary_test[y_test == 0]))
            test_loss_wrong = np.sum(y_test[y_test == 0] != (y_binary_test[y_test == 0]))
            
            win_rate_test = test_win_correct/(test_win_correct + test_loss_wrong)
            
            ## train ....
            y_predict_train = np.squeeze(y_pred_train )
            y_binary_train = (y_predict_train >= best_threshold).astype(int)
            
            # Calculating metrics
            accuracy_train = accuracy_score(y_train, y_binary_train)
            recall_train = recall_score(y_train, y_binary_train)
            precision_train = precision_score(y_train, y_binary_train)
            f1_train = f1_score(y_train, y_binary_train)
            auc_train = roc_auc_score(y_train, y_binary_train)

            train_win_correct = np.sum(y_train[y_train == 1] == (y_binary_train[y_train == 1]))
            train_win_wrong = np.sum(y_train[y_train == 1] != (y_binary_train[y_train == 1]))

            train_loss_correct = np.sum(y_train[y_train == 0] == (y_binary_train[y_train == 0]))
            train_loss_wrong = np.sum(y_train[y_train == 0] != (y_binary_train[y_train == 0]))
            
            win_rate_train = train_win_correct/(train_win_correct + train_loss_wrong)
            
            count_test = len(x_test)
            win_on_test = y_test.value_counts()[1]
            loss_on_test = y_test.value_counts()[0]
            
            count_train = len(x_train)
            win_on_train = y_train.value_counts()[1]
            loss_on_train = y_train.value_counts()[0]
            
            metrics = {
                "model_name": f'{State[i]}_{currency}{time}',
                "symbol" : f'{currency}',
                "timeframe" : f'{time}',
                "side" : f"{State[i]}",
                "version" : version, 
                "threshold": float(best_threshold),
                "count_test": int(count_test),
                "win_on_test": int(win_on_test),
                "loss_on_test": int(loss_on_test),
                "count_train": int(count_train),
                "win_on_train": int(win_on_train),
                "loss_on_train": int(loss_on_train),
                "accuracy_test": round(float(accuracy_test), 4),
                "precision_test": round(float(precision_test), 4),
                "f1_score_test": round(float(f1_test), 4),
                "auc_score_test": round(float(auc_test), 4),
                "accuracy_train": round(float(accuracy_train), 4),
                "precision_train": round(float(precision_train), 4),
                "f1_score_train": round(float(f1_train), 4),
                "auc_score_train": round(float(auc_train), 4),
                "winrate_test": round(float(win_rate_test), 4),
                "win_correct_test": int(test_win_correct),
                "loss_wrong_test": int(test_loss_wrong),
                "winrate_train": round(float(win_rate_train), 4),
                "win_correct_train": int(train_win_correct),
                "loss_wrong_train": int(train_loss_wrong),
                "timestamp" : timestamp,
            }
            if collection.find_one({"model_name" : f"{State[i]}_{currency}{time}"}) == None :
                metrics_id = collection.insert_one(metrics).inserted_id
            else :
                metrics_id = collection.update_one({"model_name" : f"{State[i]}_{currency}{time}"}, {"$set" : metrics}).upserted_id
            print(f'Metrics saved with ID: {metrics_id}')