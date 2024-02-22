from django.shortcuts import render

from django.http import JsonResponse
import MetaTrader5 as mt5

# Initialize MT5 connection
mt5.initialize()

def home(request):
    login = 510131205
    password = '!CHPfjhwE8'
    server = 'FxPro-MT5'
    if not mt5.login(login, password, server):
        return JsonResponse({'error': 'MT5 login failed'}, status=500)
    account_info = mt5.account_info()
    if account_info is None:
        return JsonResponse({'error': 'Failed to get account info'}, status=500)
    account_info_dict = {attr: getattr(account_info, attr) for attr in account_info._asdict().keys()}
    return JsonResponse(account_info_dict)

def account2(request):
    login = 510373519
    password = '!zM6rdZx4m'
    server = 'FxPro-MT5'
    if not mt5.login(login, password, server):
        return JsonResponse({'error': 'MT5 login failed'}, status=500)
    account_info = mt5.account_info()
    if account_info is None:
        return JsonResponse({'error': 'Failed to get account info'}, status=500)
    account_info_dict = {attr: getattr(account_info, attr) for attr in account_info._asdict().keys()}
    return JsonResponse(account_info_dict)