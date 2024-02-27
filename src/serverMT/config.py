import os
from dotenv import load_dotenv

load_dotenv()

login = os.environ.get('login')
password = os.environ.get('password')
server = os.environ.get('server')

mongo_url = os.environ.get('DATABASE')

version = '1.0.24.2.14'
new_path = 'src/serverMT/'