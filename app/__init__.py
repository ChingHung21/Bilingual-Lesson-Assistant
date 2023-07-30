import sys
sys.path.append("app/modules")

#導入Flask模組並建立Flask物件
from flask import Flask

app = Flask(__name__)

from app import views
