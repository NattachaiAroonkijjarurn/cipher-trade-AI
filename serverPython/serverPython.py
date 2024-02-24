from flask import Flask, request, jsonify
from flask_cors import CORS
import MetaTrader5 as mt
import subprocess
import time
import psutil

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

mt5_path = "C:/Program Files/MetaTrader 5/terminal64.exe"
mt5_process_name = "terminal64.exe"

        
def kill_mt5():
    for proc in psutil.process_iter():
        if proc.name() == mt5_process_name:
            proc.kill()
            print("MT5 process killed successfully.")
            return
    print("MT5 process not found.")

def start_mt5():
    try:
        subprocess.Popen(mt5_path)
        print("MT5 restarted successfully.")
    except Exception as e:
        print(f"Failed to start MT5: {e}")

@app.route('/checkaccountmt', methods=['POST'])
def checkAccountMT():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        server = data.get('server')
        try:
            username = int(username)
        except ValueError:
            return jsonify({"success": False, "message": "Username must be a numeric value"})
        
        mt.initialize()
        stateLogin = mt.login(username, password, server)
        if not stateLogin:
            kill_mt5()
            time.sleep(1)
            start_mt5()
            return jsonify({"success": False, "message": "Failed to login with provided credentials"})
        else:
            accountInfo = mt.account_info()
            return jsonify({"success": True, "account_info": {"name": accountInfo.name, "leverage": accountInfo.leverage, "balance": accountInfo.balance, "company": accountInfo.company}})
    except Exception as e:
        kill_mt5()
        time.sleep(1)
        start_mt5()
        return jsonify({"success": False ,"message" : "MT5 error"})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
