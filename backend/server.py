'''

main backend for reddit rewritten

handles:
1. login/register of users


'''

import os,requests,sys,pymysql
from flask import Flask,render_template,jsonify, request
from twisted.internet import reactor
from twisted.web.proxy import ReverseProxyResource
from twisted.web.resource import Resource
from twisted.web.server import Site
from twisted.web.wsgi import WSGIResource
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.errorhandler(500)
def page_not_found(e):
    return jsonify(error="Internal Server error"), 500

@app.route('/login',methods=['POST'])
def login():
    pass

@app.route('/register',methods=['POST'])
def register():
    data = request.json
    username = data["name"]
    password = data["pw"]
    return jsonify('code: 200'),200

@app.route('/api/upvote',methods=['POST'])
@auth.required
def upvote():
    pass

@app.route('/api/downvote',methods=['POST'])
@auth.required
def downvote():
    pass

@app.route('/api/getposts',methods=['GET'])
def get_posts():
    pass


#connect to database
def db_con():
    pass

resource = WSGIResource(reactor, reactor.getThreadPool(), app)
site = Site(resource)
reactor.listenTCP(3001, site)
reactor.run()

