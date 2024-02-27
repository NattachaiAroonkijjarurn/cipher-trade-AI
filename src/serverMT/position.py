from datetime import datetime
from database import collection_position, collection_order, collection_accountMT, collection_predict
import MetaTrader5 as mt
import logging
from config import new_path

logger_position = logging.getLogger('position_process')
logger_position.setLevel(logging.INFO)  # Adjust level as needed
file_handler_position = logging.FileHandler(new_path + f'log/position_process_log.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler_position.setFormatter(formatter)
logger_position.addHandler(file_handler_position)

def formClearPosition(username_mt5, symbol, comment) :
    form = {
        "positions.$.order_id" : None,
        "positions.$.username_mt5" : username_mt5,
        "positions.$.symbol" : symbol,
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
        "positions.$.comment" : comment,
        "positions.$.commission" : 0,
        "positions.$.status_payment" : False
    }
    return form

def formPushPosition(username_mt5 = None, order_id=None ,symbol= None,  status= 'close', side= None, entryprice= None, exitprice= None, entrytime= None, exittime= None, lotsize= None, tp= None, sl= None , balance= None, profit= None, comment=None) :
    form = {
            "order_id" : order_id,
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
            "comment" : comment,
            "commission" : 0,
            "status_payment" : False
        }
    return form

def formSetPosition(username_mt5 = None, order_id=None ,symbol= None,  status= 'close', side= None, entryprice= None, exitprice= None, entrytime= None, exittime= None, lotsize= None, tp= None, sl= None , balance= None, profit= None, comment=None) :
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
        "positions.$.comment" : comment,
        "positions.$.commission" : 0,
        "positions.$.status_payment" : False
    }

def getRequest(mt, symbol, type,lotsize, user_id , price, tp, sl, magic) :
    request = {
        "action": mt.TRADE_ACTION_DEAL,
        "symbol": symbol,
        "volume": lotsize,
        "type": mt.ORDER_TYPE_BUY if type == 'buy' else mt.ORDER_TYPE_SELL,
        "price": price,
        "magic": magic,
        "sl": (price - sl) if type == 'buy' else (price + sl),
        "tp": (price + tp) if type == 'buy' else (price - tp),
        "comment": f"python script open {type} {user_id}",
        "type_time": mt.ORDER_TIME_GTC,
        "type_filling": mt.ORDER_FILLING_IOC,
    }
    return request

def getSetPosition(mt, username_mt5, side, result, position_history, comment) :
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
    if result.retcode == mt.TRADE_RETCODE_DONE :
        account_info=mt.account_info()
        order_id = position_history[0].ticket
        symbol = result.request.symbol
        status = 'open'
        entryprice = result.price
        entrytime = position_history[0].time_setup * 1000 #to milliseconds
        tp = result.request.tp
        sl = result.request.sl
        lotsize = position_history[0].volume_initial
        balance = account_info.balance
    position = formSetPosition(username_mt5=username_mt5, order_id=order_id, symbol=symbol, status=status, side=side, entryprice=entryprice,exitprice='',entrytime=entrytime, exittime='',lotsize=lotsize, tp=tp, sl=sl, balance=balance, profit=0, comment=comment)
    return position

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
    
    

def calculate_profit(currency_pair, side, volume, price_open, price_close, exchange_rate=None):
    # Determine pip location and pip value for the currency pair
    if 'JPY' in currency_pair:
        pip_location = 0.01
    else:
        pip_location = 0.0001
    
    # Calculate the number of pips moved
    pips_moved = (price_close - price_open) / pip_location
    
    # For a sell order, the calculation is inverted
    if not side:
        pips_moved = -pips_moved
    
    # Calculate point value in USD for a standard lot
    if currency_pair[:3] == 'USD' or currency_pair[-3:] == 'USD':
        if currency_pair[:3] == 'USD':  # USD is the base currency
            point_value_per_lot = 100000 * pip_location / (exchange_rate if exchange_rate else price_close)
        else:  # USD is the quote currency
            point_value_per_lot = 10  # Assumes a standard lot and USD as the quote currency
    else:  # Cross currency pairs
        # This requires knowing the exchange rate to USD for the quote currency, provided externally
        point_value_per_lot = (100000 * pip_location / exchange_rate) if exchange_rate else None
        if point_value_per_lot is None:
            raise ValueError("Exchange rate needed for cross currency pairs")
    
    # Adjust point value based on the volume of the trade
    point_value = point_value_per_lot * volume
    
    # Calculate profit (or loss)
    profit = pips_moved * point_value
    
    return profit

def checkClosePosition (poss, user_id, username_mt5, password_mt5, server) :
    # if dont have position provide create new
    if not poss :
        collection_position.insert_one({"user_id" : user_id, "positions" : [] })
    
    for pos in poss['positions'] :
        if pos['status'] == 'open' and pos['username_mt5'] == username_mt5 :
            order_id = pos.get('order_id')
            # check position on mt5
            mt.initialize(login= username_mt5, password= password_mt5, server = server)
            order_mt5 = mt.history_orders_get(position=order_id)
            
            if len(order_mt5) != 2 : continue
            symbol = order_mt5[0].symbol
            side = True if order_mt5[0].type == 0 else False
            volume = order_mt5[0].volume_initial
            price_open = order_mt5[0].price_current
            price_close = order_mt5[1].price_current
            exittime = order_mt5[1].time_setup * 1000 #to milliseconds
            
            account_info = mt.account_info()
            balance = account_info.balance
            # calculate profit
            profit = calculate_profit(currency_pair=symbol, side=side, volume=volume, price_open=price_open, price_close=price_close)
            
            # if dont have order provide create new
            if not collection_order.find_one({"user_id" : user_id}) :
                collection_order.insert_one({"user_id" : user_id, "orders" : []})
                logger_position.info(f"Processing at {datetime.now()} create order empty of, user_id : {user_id}")

            collection_order.update_one({"user_id" : user_id}, {'$push' : {'orders' : pos}})
            collection_order.update_one({"user_id" : user_id, 
                                                    "orders" : { 
                                                        "$elemMatch" : { 
                                                            "order_id" : order_id }
                                                         }
                                                    }, {'$set' : {
                                                        'orders.$.status' : 'close', 
                                                        'orders.$.exitprice' : price_close, 
                                                        'orders.$.exittime' : exittime, 
                                                        'orders.$.balance' : balance,
                                                        'orders.$.profit' : profit,
                                                        'orders.$.comment' : 'closed posiition',
                                                        'orders.$.commission' : profit*0.025*36,
                                                        }
                                                    })
            
            collection_position.update_one({
                "user_id": user_id,
                "positions" : {
                    "$elemMatch" : {
                        "symbol": symbol,
                        "username_mt5" : username_mt5
                    }
                }
            }, {'$set': formClearPosition(username_mt5=username_mt5, symbol=pos.get('symbol'), comment='closed position success')})
            logger_position.info(f"Processing at {datetime.now()} close position success and update to collection orders of username_mt5, {username_mt5}, order_id : {order_id}, symbol : {symbol}, user_id : {user_id}")
            mt.shutdown() 
    
def checkPrediction(account_mt, username_mt5, user_id, password_mt5, server) :
    for bot in account_mt['bots'] :
        if bot['status'] != 'active' : continue
        model_name = bot.get('model_name')
        timeframe = bot.get('timeframe')
        lotsize = bot.get('lotsize')
        
        # check have position that username_mt5 and symbol
        positions = collection_position.find_one({
                                        "user_id": user_id, 
                                        "positions": {
                                            "$elemMatch": {
                                                "username_mt5": username_mt5,
                                                "symbol": model_name,
                                            }
                                        }
                                    })
        
        if not positions: 
            collection_position.update_one({"user_id" : user_id}, {'$push': {'positions': formPushPosition(username_mt5=username_mt5,symbol=model_name)}})
            logger_position.info(f"Processing at {datetime.now()} push new position to collection positions of username_mt5 : {username_mt5}, symbol : {model_name}, user_id : {user_id}")
            continue
        
        
        # position is open now?
        count_position = []
        for position in positions['positions'] :
            if position.get("symbol") == model_name and position.get("username_mt5") == username_mt5 :
                count_position = position
                break
        if count_position.get("status") == "open" : continue
        
        query = {"currency_pair" : model_name+timeframe}
        pred_doc = collection_predict.find_one(query)
        marketOpen = pred_doc.get('marketOpen')
        pred_buy = pred_doc.get('predict_buy')
        pred_sell = pred_doc.get('predict_sell')
        
        if marketOpen == 'close' : continue
        if pred_buy != 'buy' and pred_sell != 'sell' : continue
        
        # buy condition
        if pred_buy == 'buy' :
            result, position_history, comment = buyCondition(user_id=user_id, username_mt5=username_mt5, password_mt5=password_mt5, server=server, model_name=model_name,timeframe=timeframe, lotsize=lotsize, magic=234000)
            logBuyCondition(result, comment, 'buy' ,user_id, username_mt5, position_history)
            updatePosition = getSetPosition(mt=mt, username_mt5=username_mt5, side='buy', result=result, position_history=position_history, comment=comment)
            collection_position.update_one({
                "user_id" : user_id, 
                "positions" : { 
                    "$elemMatch" : {
                        'symbol' : model_name, 
                        'username_mt5' : username_mt5}}}, 
                {'$set': updatePosition})
            logger_position.info(f"Processing at {datetime.now()} update position buy in collection positions of username_mt5 : {username_mt5}, user_id : {user_id}")
            
        # sell condition
        elif pred_sell == 'sell' :
            result, position_history, comment = sellCondition(user_id=user_id, username_mt5=username_mt5, password_mt5=password_mt5, server=server, model_name=model_name, timeframe=timeframe, lotsize=lotsize, magic=234000)
            logBuyCondition(result, comment, 'sell' ,user_id, username_mt5, position_history)
            updatePosition = getSetPosition(mt=mt, username_mt5=username_mt5, side='sell', result=result, position_history=position_history, comment=comment)
            collection_position.update_one({
                "user_id" : user_id, 
                "positions" : { 
                    "$elemMatch" : {
                        'symbol' : model_name, 
                        'username_mt5' : username_mt5}}}, 
                {'$set': updatePosition})
            logger_position.info(f"Processing at {datetime.now()} update position sell in collection positions of username_mt5 : {username_mt5}, user_id : {user_id}")
        
def buyCondition(user_id, username_mt5, password_mt5, server, model_name,timeframe, lotsize, magic) :
    mt.initialize(login= username_mt5, password= password_mt5, server = server)
    sl, tp = takeAndStop(timeframe)
    price = mt.symbol_info_tick(model_name).ask
    
    request = getRequest(mt=mt, symbol=model_name, lotsize=lotsize, type='buy',user_id=user_id, price=price, tp=tp, sl=sl, magic=magic)
    result = mt.order_send(request)
    comment = result.comment
    position_history = mt.history_orders_get(position=result.order)
    
    return result, position_history, comment

def sellCondition(user_id, username_mt5, password_mt5, server, model_name,timeframe, lotsize, magic) :
    mt.initialize(login= username_mt5, password= password_mt5, server = server)
    sl, tp = takeAndStop(timeframe)
    price = mt.symbol_info_tick(model_name).bid
    
    request = getRequest(mt=mt, symbol=model_name, lotsize=lotsize, type='sell',user_id=user_id, price=price, tp=tp, sl=sl, magic=magic)
    result = mt.order_send(request)
    comment = result.comment
    position_history = mt.history_orders_get(position=result.order)
    
    return result, position_history, comment

def logBuyCondition(result, comment, side ,user_id, username_mt5, position_history) :
    if result.retcode != mt.TRADE_RETCODE_DONE :
        logger_position.info(f"Processing at {datetime.now()} send order {side} false {comment} of username_mt5 : {username_mt5}, user_id : {user_id}")
    else :
        order_id = position_history[0].ticket
        symbol = result.request.symbol
        logger_position.info(f"Processing at {datetime.now()} send order {side} success {comment} of username_mt5 : {username_mt5}, symbol : {symbol},order_id : {order_id}, user_id : {user_id}")
    

def task_position(account_mt):
    user_id = account_mt.get("user_id")
    username_mt5 = account_mt.get("username_mt5")
    password_mt5 = account_mt.get("password_mt5")
    server = account_mt.get("server")
    
    poss = collection_position.find_one({"user_id": user_id})
    if poss:
        checkClosePosition(poss=poss, user_id=user_id, username_mt5=username_mt5, password_mt5=password_mt5, server=server)
    checkPrediction(account_mt=account_mt, username_mt5=username_mt5, user_id=user_id, password_mt5=password_mt5, server=server)

