'''

main backend for reddit rewritten

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

    return jsonify(username),200


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

    return jsonify(username),200

@app.route('/api/upvote',methods=['POST'])
def upvote():
    data = request.json
    upvoteCount = data
    db_con()
    sqlUpdate = """update posts set upvote = upvote+1 where id = %d"""%(upvoteCount)

    try:
        cursor.execute(sqlUpdate)
        db.commit()
    except:
        db.rollback()
        print("Error updating data")
        return jsonify(error='error updating data'),500
    return jsonify("ok"),200

@app.route('/api/newpost',methods=['POST'])
def new_post():
    db_con()
    data = request.json
    print(data)
    '''
    if text exists post_body = text
    else if image exists post_body = image
    else if link exists post_body = link
    '''
    title = data['post_title'] #title is always required
    post_body = None
    if data['post_text']:
        post_body = data['post_text']
    elif data['myImage']:
        post_body = data['myImage']
    elif data['link']:
        post_body = data['link']
    print(post_body)


    upvote = 1
    print("New post with title %s" %title)
    try:
        sqlInsert = ("""insert into posts (title,text,upvote) VALUES("%s","%s",1)"""%(title,post_body))
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
    except:
        print("error unable to select post data")
        db.rollback()
        return jsonify('error: unable to select data'),500
    return jsonify(new_posts),200

@app.route('/api/upload/', methods=['POST'])
def upload_file():
    print("Incoming request!")
    file = request.files['file']
    print(file)
    dir = os.path.join("../public/",file.filename)
    file.save(dir)
    resp = "http://192.168.1.4:3000/" + file.filename
    print(resp)
    return jsonify(resp),200



def db_con():
    global cursor
    global db
    db = pymysql.connect("localhost","admin","password","rewritten")
    cursor = db.cursor()

resource = WSGIResource(reactor, reactor.getThreadPool(), app)
site = Site(resource)
reactor.listenTCP(3001, site)
reactor.run()

