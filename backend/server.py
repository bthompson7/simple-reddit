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
    db_con()
    sqlSelect = """select * from users where username = "%s" """ %(username)

    try:
        cursor.execute(sqlSelect)
        db.commit()
        res = cursor.fetchall()
        check = bcrypt.check_password_hash(res[0][2], password)
        if check is False:
            return jsonify(error='Invalid username or password'),401

    except:
        db.rollback()
        print("Error")
        return jsonify(error='Invalid username or password'),500

    return jsonify('code: 200'),200


@app.route('/register',methods=['POST'])
def register():
    data = request.json
    username = data["name"]
    password = data["pw"]
    print("Got new user named ", username)
    db_con()
    pw_hash = bcrypt.generate_password_hash(password)
    pw_hash2 = str(pw_hash.decode("utf-8")) 
    print(pw_hash2)
    sqlInsert = ("""INSERT INTO users (username,password) VALUES("%s","%s")"""%(username,pw_hash2))

    try:
        cursor.execute(sqlInsert)
        db.commit()
    except:
        db.rollback()
        print("Error inserting data")
        return jsonify(error='401'),401

    return jsonify('code: 200'),200

'''
generate post id in backend store post id with post text etc...



'''
@app.route('/api/upvote/<string:id>',methods=['POST'])
def upvote():
    pass

'''

new posts table is
id - int
title - varchar(50)
text - varchar(10000)

'''

@app.route('/api/newpost',methods=['POST'])
def new_post():
    db_con()
    data = request.json
    print(data)
    title = data['post_title']
    text = data['post_text']
    print(title)
    print(text)
    print("New post with title %s" %title)
    try:
        sqlInsert = ("""insert into posts (title,text) VALUES("%s","%s")"""%(title,text))
        cursor.execute(sqlInsert)
        db.commit()
    except:
        print("error unable to insert post data")
        db.rollback()
        return jsonify('error: unable to insert data'),500
    return jsonify('code: 200'),200
    

@app.route('/api/getposts',methods=['GET'])
def get_posts():
    db_con()
    try:
        sqlSelect = "select * from posts order by id desc"
        cursor.execute(sqlSelect)
        db.commit()
        new_posts = cursor.fetchall()
        print(new_posts)
    except:
        print("error unable to select post data")
        db.rollback()
        return jsonify('error: unable to select data'),500
    return jsonify(new_posts),200



#connect to database => users table
def db_con():
    global cursor
    global db
    db = pymysql.connect("localhost","admin","password","rewritten")
    cursor = db.cursor()

resource = WSGIResource(reactor, reactor.getThreadPool(), app)
site = Site(resource)
reactor.listenTCP(3001, site)
reactor.run()

