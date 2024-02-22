from keras.models import load_model
import pandas as pd
import numpy as np
import MetaTrader5 as mt
from datetime import datetime, timedelta
import pytz
import os
import joblib
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import MetaTrader5 as mt1
import logging

from find_win_loss import getAllindiforTest
from function_indicator import GetAll_indicator

logging.basicConfig(filename='server_log.log', level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

load_dotenv()
mt.initialize()

login = 510131205
password = '!6TootpkH0'
server = 'FxPro-MT5'
mt1.login(login, password, server)

desired_timezone = pytz.timezone('Europe/Istanbul')

# Get the current time in the desired time zone
current_time = datetime.now(desired_timezone) + timedelta(days=1)  # Setting it to a future date

no_of_row = 252

def process_currency_pair(currency, interval):
    ohlc = pd.DataFrame(mt1.copy_rates_from(currency, setTimeFrame(interval), current_time, no_of_row))
    ohlc = GetAll_indicator(ohlc)
    data = getAllindiforTest(ohlc)
    # load model scaler data
    model_buy = load_model(f'modelBuy/buy_{currency}{interval}.h5')
    model_sell = load_model(f'modelSell/sell_{currency}{interval}.h5')
    scaler_buy = joblib.load(f'scalerBuy/scaler_{currency}{interval}.joblib')
    scaler_sell = joblib.load(f'scalerSell/scaler_{currency}{interval}.joblib')
    
    scalers = {
        'buy': scaler_buy,
        'sell': scaler_sell
    }
    models = {
        'buy' : model_buy,
        'sell' : model_sell
    }
    # print(data)
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
        logging.info(f"Processing {currency} for interval {interval} at {datetime.now()} not crossover {market}")
    elif data['cross'].iloc[-1] == 1 :
        timestamp = int(datetime.now().timestamp())
        state = 'buy'
        scaler = scalers.get(state, 'none')
        model = models.get(state, 'none')
        
        data = dropColumn(data)
        x_test_scaled = scaler.transform(data)
        x_test_reshaped = np.reshape(x_test_scaled, (x_test_scaled.shape[0], 1, x_test_scaled.shape[1]))
        y_pred = model.predict(x_test_reshaped)
        
        query = {"model_name" : f'{state}_{currency}{interval}'}
        document = collection_models.find_one(query)
        threshold = document.get('threshold') if document else None

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
        logging.info(f"Processing {currency} for interval {interval} at {datetime.now()} crossover : {pred}  {market}")
        
    elif data['cross'].iloc[-1] == 2 :
        timestamp = int(datetime.now().timestamp())
        state = 'sell'
        scaler = scalers.get(state, 'none')
        model = models.get(state, 'none')
        
        data = dropColumn(data)
        x_test_scaled = scaler.transform(data)
        x_test_reshaped = np.reshape(x_test_scaled, (x_test_scaled.shape[0], 1, x_test_scaled.shape[1]))
        y_pred = model_buy.predict(x_test_reshaped)
        
        query = {"model_name" : f'{state}_{currency}{interval}'}
        document = collection_models.find_one(query)
        threshold = document.get('threshold') if document else None

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
        logging.info(f"Processing {currency} for interval {interval} at {datetime.now()} crossunder : {pred}  {market}")
    

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
                print(f"Task raised an exception: {e}")




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




client = MongoClient(os.environ.get('mongourl'))
db = client['CipherTrade']
collection_predict = db['predictions']
collection_accountMT = db['account_metaTrade']
collection_position = db['positions']
collection_models = db['models']
collection_order = db['orders']
collection_bot = db['bots']

def createNewPosition(user_id, username_mt5, symbol,  status, side, entryprice, exitprice, entrytime, exittime, lotsize, tp, sl , balance, profit) :
    return {
        "user_id" : user_id,
        "positions" : [
            {
                "username_mt5" : username_mt5,
                "symbol": symbol,
                'status' : status,
                "side": side ,
                "entryprice": entryprice,
                "exitprice": exitprice,
                "entrytime": entrytime,
                "exittime": exittime,
                "lotsize": lotsize,
                "tp": tp,
                "sl": sl,
                "balance": balance,
                "profit": profit,
            }
        ]
    }
    
def createAccountPosition(user_id) :
    return {
        "user_id" : user_id ,
        "positions" : [] 
    }
    
def createSetPosition(username_mt5, order_id ,symbol,  status, side, entryprice, exitprice, entrytime, exittime, lotsize, tp, sl , balance, profit, comment) :
    return {
        "positions.$.username_mt5" : username_mt5,
        "positions.$.order_id" : order_id,
        "positions.$.symbol": symbol,
        'positions.$.status' : status,
        "positions.$.side": side ,
        "positions.$.entryprice": entryprice,
        "positions.$.exitprice": exitprice,
        "positions.$.entrytime": entrytime,
        "positions.$.exittime": exittime,
        "positions.$.lotsize": lotsize,
        "positions.$.tp": tp,
        "positions.$.sl": sl,
        "positions.$.balance": balance,
        "positions.$.profit": profit,
        "positions.$.comment" : comment
    }
    
    
def createAddPosition(username_mt5 = None, order_id=None ,symbol= None,  status= 'close', side= None, entryprice= None, exitprice= None, entrytime= None, exittime= None, lotsize= None, tp= None, sl= None , balance= None, profit= None, comment=None) :
    return {
            "username_mt5" : username_mt5,
            "order_id" : order_id,
            "symbol": symbol,
            'status' : status,
            "side": side ,
            "entryprice": entryprice,
            "exitprice": exitprice,
            "entrytime": entrytime,
            "exittime": exittime,
            "lotsize": lotsize,
            "tp": tp,
            "sl": sl,
            "balance": balance,
            "profit": profit,
            "comment" : comment
        }

    
def takeAndStop(time) :
    if time == '5m' :
        return 0.00050,  0.00100
    if time == '15m' :
        return 0.00100, 0.00200
    if time == '30m' :
        return 0.00250, 0.00500
    if time == '1h' :
        return 0.00400, 0.00800
    if time == '2h' :
        return 0.00500, 0.01000
    if time == '4h' :
        return 0.00600, 0.01200

def getSide(side) :
    if side == 'buy' :
        return mt.ORDER_TYPE_BUY
    if side == 'sell' :
        return mt.ORDER_TYPE_SELL
    
def extract_order_info(order):
    symbol = order.symbol
    entryPrice = order.price
    entryTime = order.time_setup
    tp = order.tp
    sl = order.sl
    return symbol, entryPrice, entryTime, tp, sl

def getRequest(mt, currency_pair, lotsize, pred , user_id , price, tp, sl) :
    request = {
        "action": mt.TRADE_ACTION_DEAL,
        "symbol": currency_pair,
        "volume": lotsize,
        "type": getSide(pred),
        "price": price,
        "sl": price - sl,
        "tp": price + tp,
        "comment": f"python script open {pred} {user_id}",
        "type_time": mt.ORDER_TIME_GTC,
        "type_filling": mt.ORDER_FILLING_IOC,
    }
    return request

def getSetPosition(mt, username_mt5 , result, position_history_orders, comment) :
    account_info=None
    order_id = None
    symbol = result.request.symbol
    status = 'close'
    entryprice = None
    entrytime = None
    tp = None
    sl = None
    lotsize = None
    balance = None
    if comment == 'Request executed' :
        account_info=mt.account_info()
        order_id = position_history_orders[0].ticket
        symbol = result.request.symbol
        status = 'open'
        entryprice = result.price
        entrytime = position_history_orders[0].time_setup
        tp = result.request.tp
        sl = result.request.sl
        lotsize = position_history_orders[0].volume_initial
        balance = account_info.balance
    
    position = createSetPosition(username_mt5, order_id, symbol, status,'buy', entryprice,'none',entrytime, '',lotsize, tp, sl, balance, 0, comment)
    # print(position)
    return position

def server():
    currency_pairs = ['EURUSD', 'GBPUSD', 'USDJPY','AUDUSD', 'USDCHF', 'USDCAD']

    # Map textual intervals to a function that checks if the current time aligns with the schedule
    interval_checks = {
        '5m': lambda now: now.minute % 5 == 0 ,
        '15m': lambda now: now.minute % 15 == 0 ,
        '30m': lambda now: now.minute % 30 == 0 ,
        '1h': lambda now: now.minute == 0 ,
        '2h': lambda now: now.hour % 2 == 0 and now.minute == 0 ,
        '4h': lambda now: now.hour % 4 == 0 and now.minute == 0 ,
    }
    while True:
        accounts_mt = collection_accountMT.find()
        for account_mt in accounts_mt:
            # print(account_mt)
            user_id = account_mt.get("user_id")
            username_mt5 = account_mt.get("username_mt5")
            password_mt5 = account_mt.get("password_mt5")
            server = account_mt.get("server")
            
            poss = collection_position.find_one({"user_id" : user_id})
            if poss == None : 
                collection_position.insert_one(createAccountPosition(user_id))
                continue
            for pos in poss['positions'] :
                if pos.get('status') == 'open' :
                    mt.login(username_mt5, password_mt5, server)
                    order_id = pos.get('order_id')
                    pho = mt.history_orders_get(position=order_id)
                    if len(pho) == 2 :
                        account_info=mt.account_info()
                        balance = account_info.balance
                        pre_balance = pos.get('balance')
                        profit = balance - pre_balance
                        
                        if collection_order.find_one({"user_id" : user_id}) == None :
                            collection_order.insert_one({"user_id" : user_id, "orders" : []})
                        
                        query = {
                            "user_id": user_id,
                            "positions.symbol": pos.get('symbol')
                        }
                        updatePosition = {
                            "positions.$.username_mt5" : None,
                            "positions.$.order_id" : None,
                            'positions.$.status' : 'close',
                            "positions.$.side": None ,
                            "positions.$.entryprice": None,
                            "positions.$.exitprice": None,
                            "positions.$.entrytime": None,
                            "positions.$.exittime": None,
                            "positions.$.lotsize": None,
                            "positions.$.tp": None,
                            "positions.$.sl": None,
                            "positions.$.balance": None,
                            "positions.$.profit": None,
                            "positions.$.comment" : 'closed posiition'
                        }
                        print(pos.get('order_id'))
                        collection_order.update_one({"user_id" : user_id}, {'$push' : {'orders' : pos}})
                        collection_order.update_one({"user_id" : user_id, 
                                                     "orders" : { 
                                                         "$elemMatch" : { 
                                                             "order_id" : pos.get('order_id') }
                                                         }
                                                     }, {'$set' : {
                                                         'orders.$.status' : 'close', 
                                                         'orders.$.exitprice' : pho[1].price_current, 
                                                         'orders.$.exittime' : pho[1].time_setup, 
                                                         'orders.$.balance' : balance,
                                                         'orders.$.profit' : profit,
                                                         'orders.$.comment' : 'closed posiition'
                                                        }
                                                    })
                        collection_position.update_one(query, {'$set': updatePosition})
                        
            for bot in account_mt['bots']:
                
                if bot.get('status') == 'active' :
                    username_mt5 = account_mt.get("username_mt5")
                    model_name = bot.get('model_name')
                    timeframe = bot.get('timeframe')
                    lotsize = bot.get('lotsize')
                    
                    positions = collection_position.find_one({"user_id" : user_id})
                    if positions == None : 
                        collection_position.insert_one(createAccountPosition(user_id))
                    check_position = collection_position.find_one({
                                        "user_id": user_id, 
                                        "positions": {
                                            "$elemMatch": {
                                                "symbol": model_name
                                            }
                                        }
                                    })

                    if check_position == None :
                        collection_position.update_one({"user_id" : user_id}, {'$push': {'positions': createAddPosition(symbol=model_name)}})
                    
                    positions = collection_position.find_one({"user_id" : user_id})
                    count_position = ''
                    
                    for position in positions['positions'] :
                        if position.get("symbol") == model_name :
                            count_position = position
                            break
                    
                    if count_position.get("status") == 'open' : continue
                    
                    query = {"currency_pair" : model_name+timeframe}
                    pred_doc = collection_predict.find_one(query)
                    marketOpen = pred_doc.get('marketOpen')
                    pred_buy = pred_doc.get('predict_buy')
                    pred_sell = pred_doc.get('predict_sell')
                    
                    if marketOpen == 'close' : continue
                    if pred_buy == 'none' and pred_sell == 'none' : continue
                    
                    
                    
                    if pred_buy == 'buy' :
                        mt.login(username_mt5, password_mt5, server)
                        sl, tp = takeAndStop(timeframe)
                        price = mt.symbol_info_tick(model_name).ask
                        
                        request = getRequest(mt, model_name, lotsize, pred_buy, user_id, price, tp, sl)
                        
                        result = mt.order_send(request)
                        comment = result.comment
                        print(result)
                        
                        position_history_orders=mt.history_orders_get(position=result.order)
                        updatePosition = getSetPosition(mt, username_mt5, result, position_history_orders, comment)
                        query = {
                            "user_id": user_id,
                            "positions.symbol": model_name
                        }
                        collection_position.update_one({"user_id" : user_id, "positions" : { "$elemMatch" : {'symbol' : model_name}}}, {'$set': updatePosition})
                        
                    elif pred_sell == 'sell' :
                        mt.login(username_mt5, password_mt5, server)
                        sl, tp = takeAndStop(timeframe)
                        price = mt.symbol_info_tick(model_name).ask
                        
                        request = getRequest(mt, model_name, lotsize, pred_sell, user_id, price, tp, sl)
                        
                        result = mt.order_send(request)
                        comment = result.comment
                        
                        position_history_orders=mt.history_orders_get(position=result.order)
                        updatePosition = getSetPosition(mt, username_mt5, result, position_history_orders, comment)
                        query = {
                            "user_id": user_id,
                            "positions.symbol": model_name
                        }
                        collection_position.update_one({"user_id" : user_id, "positions" : { "$elemMatch" : {'symbol' : model_name}}}, {'$set': updatePosition})
                        
                        
        now = datetime.now()
        intervals_to_run = [interval for interval, check in interval_checks.items() if check(now)]
        if intervals_to_run:
            time.sleep(0.5)
            print(f"Running tasks for intervals {intervals_to_run} at {now}")
            logging.info(f"Running tasks for intervals {intervals_to_run} at {now}")
            run_tasks(currency_pairs, intervals_to_run)

            time_to_next_minute = 60 - datetime.now().second
            time.sleep(time_to_next_minute)
        else:
            time.sleep(0)
        
        
        time.sleep(0)  # Example: sleep for 60 seconds

try:
    server()
except OSError or ValueError or Exception as e:
    logging.critical(f"Critical failure in server function: {e}")
    print(f"Scheduler error: {e}")
    
    