from keras.models import load_model
import pandas as pd
import numpy as np
import MetaTrader5 as mt
from datetime import datetime, timedelta
import pytz
import joblib
from datetime import datetime
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import MetaTrader5 as mt
import logging

from function.find_win_loss import getAllindiforTest
from function.function_indicator import GetAll_indicator
from database import collection_predict, collection_models
from config import login, password, server, version, new_path

import sys

sys.stdout.reconfigure(encoding='utf-8')

logger_prediction = logging.getLogger('prediction_process')
logger_prediction.setLevel(logging.INFO)  # Adjust level as needed
file_handler_prediction = logging.FileHandler(new_path + 'log/prediction_process_log.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler_prediction.setFormatter(formatter)
logger_prediction.addHandler(file_handler_prediction)


desired_timezone = pytz.timezone('Europe/Istanbul')
# Get the current time in the desired time zone
current_time = datetime.now(desired_timezone) + timedelta(days=1)  # Setting it to a future date

no_of_row = 252

currency_pairs = ['EURUSD', 'GBPUSD', 'AUDUSD', 'USDCHF', 'USDCAD']

# Map textual intervals to a function that checks if the current time aligns with the schedule
interval_checks = {
    '5m': lambda now: now.minute % 5 == 0 ,
    '15m': lambda now: now.minute % 15 == 0 ,
    '30m': lambda now: now.minute % 30 == 0 ,
    '1h': lambda now: now.minute == 0 ,
    '2h': lambda now: now.hour % 2 == 0 and now.minute == 0 ,
    '4h': lambda now: now.hour % 4 == 0 and now.minute == 0 ,
}

def createPredict(curreny_pair, predict_buy, predict_sell, timestamp, timedata, marketopen) :
    return {
        "currency_pair" : curreny_pair,
        "predict_buy" : predict_buy,
        "predict_sell" : predict_sell,
        "timestamp" : int(timestamp),
        "timedata" : int(timedata),
        "marketOpen" : marketopen
    }
def dropColumn(df) :
    return df.drop(columns=['time', 'open', 'high', 'low', 'close', 'tick_volume', 'spread', 'real_volume', 'EMA50', 'EMA200', 'cross'])

def setTimeFrame(interval) :
    if interval == '5m' :
        return mt.TIMEFRAME_M5
    if interval == '15m' :
        return mt.TIMEFRAME_M15
    if interval == '30m' :
        return mt.TIMEFRAME_M30
    if interval == '1h' :
        return mt.TIMEFRAME_H1
    if interval == '2h' :
        return mt.TIMEFRAME_H2
    if interval == '4h' :
        return mt.TIMEFRAME_H4

def process_currency_pair(currency, interval):
    ohlc = pd.DataFrame(mt.copy_rates_from(currency, setTimeFrame(interval), current_time, no_of_row))
    ohlc = GetAll_indicator(ohlc)
    data = getAllindiforTest(ohlc)
    # load model scaler data
    model_buy = load_model(new_path + f'/data/{version}/model/modelBuy/buy_{currency}{interval}.h5')
    model_sell = load_model(new_path + f'/data/{version}/model/modelSell/sell_{currency}{interval}.h5')
    scaler_buy = joblib.load(new_path + f'/data/{version}/scaler/scalerBuy/scaler_{currency}{interval}.joblib')
    scaler_sell = joblib.load(new_path + f'/data/{version}/scaler/scalerSell/scaler_{currency}{interval}.joblib')
    
    scalers = {
        'buy': scaler_buy,
        'sell': scaler_sell
    }
    models = {
        'buy' : model_buy,
        'sell' : model_sell
    }

    data = data.iloc[:-1]
    time_data = data['time'].iloc[-1]
    market = ''
    # checkcross
    if data['cross'].iloc[-1] == 0 :
        timestamp = int(datetime.now().timestamp())
        query = {"currency_pair" : f'{currency}{interval}'}
        doc_find = collection_predict.find_one(query)
        if doc_find == None :
            doc = createPredict(f'{currency}{interval}', 'none', 'none', timestamp, time_data, 'close')
            collection_predict.insert_one(doc)
        else :
            doc = {}
            if doc_find.get('timedata') == time_data :
                doc = createPredict(f'{currency}{interval}', 'none', 'none', timestamp, time_data, 'close')
                collection_predict.find_one_and_replace(filter=query, replacement=doc)
                market = 'close'
            else :
                doc = createPredict(f'{currency}{interval}', 'none', 'none', timestamp, time_data, 'open')
                collection_predict.find_one_and_replace(filter=query, replacement=doc)
                market = 'open'
        print(f"Processing {currency} for interval {interval} at {datetime.now()} not crossover {market}")
        logger_prediction.info(f"Processing {currency} for interval {interval} at {datetime.now()} not crossover {market}")
    elif data['cross'].iloc[-1] == 1 :
        timestamp = int(datetime.now().timestamp())
        state = 'buy'
        scaler = scalers.get(state, 'none')
        model = models.get(state, 'none')
        
        data = dropColumn(data)
        x_test_scaled = scaler.transform(data)
        x_test_reshaped = np.reshape(x_test_scaled, (x_test_scaled.shape[0], 1, x_test_scaled.shape[1]))
        y_pred = model.predict(x_test_reshaped)
        
        query = {"model_name" : f'{currency}{interval}'}
        document = collection_models.find_one(query)
        threshold = document.get('threshold_buy') if document else None

        y_pred = np.squeeze(y_pred)
        y_binary = (y_pred >= threshold).astype(int)
        pred = f'{state}' if y_binary == 1 else 'not buy'

        query = {"currency_pair" : f'{currency}{interval}'}
        doc_find = collection_predict.find_one(query)
        if doc_find == None :
            doc = createPredict(f'{currency}{interval}', 'none', 'none', timestamp, time_data, 'close')
            collection_predict.insert_one(doc)
        else :
            doc = {}
            if doc_find.get('timedata') == time_data :
                doc = createPredict(f'{currency}{interval}', pred, 'none', timestamp, time_data, 'close')
                collection_predict.find_one_and_replace(filter=query, replacement=doc)
                market = 'close'
            else :
                doc = createPredict(f'{currency}{interval}', pred, 'none', timestamp, time_data, 'open')
                collection_predict.find_one_and_replace(filter=query, replacement=doc)
                market = 'open'
        print(f"Processing {currency} for interval {interval} at {datetime.now()} crossover : {pred}  {market}")
        logger_prediction.info(f"Processing {currency} for interval {interval} at {datetime.now()} crossover : {pred}  {market}")
        
    elif data['cross'].iloc[-1] == 2 :
        timestamp = int(datetime.now().timestamp())
        state = 'sell'
        scaler = scalers.get(state, 'none')
        model = models.get(state, 'none')
        
        data = dropColumn(data)
        x_test_scaled = scaler.transform(data)
        x_test_reshaped = np.reshape(x_test_scaled, (x_test_scaled.shape[0], 1, x_test_scaled.shape[1]))
        y_pred = model.predict(x_test_reshaped)
        
        query = {"model_name" : f'{currency}{interval}'}
        document = collection_models.find_one(query)
        threshold = document.get('threshold_sell') if document else None

        y_pred = np.squeeze(y_pred)
        y_binary = (y_pred >= threshold).astype(int)
        pred = f'{state}' if y_binary == 1 else 'not sell'

        query = {"currency_pair" : f'{currency}{interval}'}
        doc_find = collection_predict.find_one(query)
        if doc_find == None :
            doc = createPredict(f'{currency}{interval}', 'none', 'none', timestamp, time_data, 'close')
            collection_predict.insert_one(doc)
        else :
            doc = {}
            if doc_find.get('timedata') == time_data :
                doc = createPredict(f'{currency}{interval}', 'none', pred, timestamp, time_data, 'close')
                collection_predict.find_one_and_replace(filter=query, replacement=doc)
                market = 'close'
            else :
                doc = createPredict(f'{currency}{interval}', 'none', pred, timestamp, time_data, 'open')
                collection_predict.find_one_and_replace(filter=query, replacement=doc)
                market = 'open'
        print(f"Processing {currency} for interval {interval} at {datetime.now()} crossunder : {pred}  {market}")
        logger_prediction.info(f"Processing {currency} for interval {interval} at {datetime.now()} crossunder : {pred}  {market}")

def run_tasks(currency_pairs, intervals_to_run):
    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(process_currency_pair, currency, interval)
            for interval in intervals_to_run
            for currency in currency_pairs
        ]
        # Wait for all submitted tasks to complete
        for future in as_completed(futures):
            try:
                future.result()  # Handle the result or exceptions if necessary
            except Exception as e:
                logger_prediction.error(f"Task raised an exception: {e}")
                print(f"Task raised an exception: {e}")


def task_prediction() :
    now = datetime.now()
    intervals_to_run = [interval for interval, check in interval_checks.items() if check(now)]
    if intervals_to_run:
        time.sleep(0.5)
        mt.initialize(login= int(login), password= password, server = server)
        print(f"Running tasks for intervals {intervals_to_run} at {now}")
        logger_prediction.info(f"Running tasks for intervals {intervals_to_run} at {now}")
        run_tasks(currency_pairs, intervals_to_run)

        time_to_next_minute = 60 - datetime.now().second
        time.sleep(time_to_next_minute)
    else:
        time.sleep(0)