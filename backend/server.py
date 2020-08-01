'''

main backend for reddit rewritten

handles:
1. login/register of users

Backend TODO:
1. setup login/register tables

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
from passlib.hash import sha256_crypt

app = Flask(__name__)
CORS(app)

@app.errorhandler(500)
def page_not_found(e):
    return jsonify(error="Internal Server error"), 500

@app.route('/login',methods=['POST'])
def login():
    #if username exists and password we are given matches the stored password we are good
    data = request.json
    username = data["name"]
    password = data["pw"]
    '''
    essentially to check the password just hash the password
     we are given and if it matches the one in the db we are good

    https://pythonprogramming.net/password-hashing-flask-tutorial/
    encryptPassword = sha256_crypt.encrypt(password)
    print(encryptPassword)
		
    '''
    return jsonify('code: 200'),200


@app.route('/register',methods=['POST'])
def register():
    data = request.json
    username = data["name"]
    password = data["pw"]
    #if username doesn't exist then we are good

    '''
    https://pythonprogramming.net/password-hashing-flask-tutorial/
    encryptPassword = sha256_crypt.encrypt(password)
    print(encryptPassword)	
    '''
    return jsonify('code: 200'),200

@app.route('/api/upvote',methods=['POST'])
def upvote():
    pass

@app.route('/api/downvote',methods=['POST'])
def downvote():
    pass

@app.route('/api/getposts',methods=['GET'])
def get_posts():
    pass


#connect to database
def db_con():
    global cursor
    global db
    db = pymysql.connect("localhost","monitor","password","temps")
    cursor = db.cursor()

resource = WSGIResource(reactor, reactor.getThreadPool(), app)
site = Site(resource)
reactor.listenTCP(3001, site)
reactor.run()

