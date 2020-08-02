'''

main backend for reddit rewritten

handles:
1. login/register of users

Backend TODO:
1. setup login/register tables - done
2. setup cookies so user stays logged in

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
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

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
    		
    a query like => select * from users where user = user and pass = encryptPassword


    '''
    #sqlSelect = "select * from users where user = VALUE(?) and pass = VALUE(?)",%(username,pw_hash)
    db_con_users()

    print(username)
    #sqlSelect = ("""select * from users where username = VALUE("%s")""" %(username))
    sqlSelect = """select * from users where username = "%s" """ %(username)
    try:
        cursor.execute(sqlSelect)
        db.commit()
        res = cursor.fetchall()
        print(res[0][2])
        check = bcrypt.check_password_hash(res[0][2], password)
        print(check)
        if check is False:
            return jsonify(error='Invalid username or password'),401

    except:
        db.rollback()
        print("Error")
        return jsonify(error='Invalid username or password'),500

    return jsonify('code: 200','username:'username),200


@app.route('/register',methods=['POST'])
def register():
    data = request.json
    username = data["name"]
    password = data["pw"]
    print("Got new user named ", username)
    #if username doesn't exist then we are good

    '''
    encryptPassword = sha256_crypt.encrypt(password)
    print(encryptPassword)	

    q query like => insert into users values(?,?),username,encryptPassword

    users table will be like 
    user - varchar
    password - varchar


    '''
    db_con_users()
    print(password)
    pw_hash = bcrypt.generate_password_hash(password)
    print(pw_hash)	
    pw_hash2 = str(pw_hash.decode("utf-8")) 
    print(pw_hash2)
    sqlInsert = ("""INSERT INTO users (username,password) VALUES("%s","%s")"""%(username,pw_hash2))

    try:
        cursor.execute(sqlInsert)
        db.commit()
    except:
        db.rollback()
        print("Error inserting data")
        return jsonify(error='500'),500

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


#connect to database => users table
def db_con_users():
    global cursor
    global db
    db = pymysql.connect("localhost","admin","password","rewritten")
    cursor = db.cursor()

resource = WSGIResource(reactor, reactor.getThreadPool(), app)
site = Site(resource)
reactor.listenTCP(3001, site)
reactor.run()

