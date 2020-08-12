'''

main backend for reddit rewritten

Finished:
1. actually display images instead of a link
2. be able to sort posts by new/hot/top
3. Changed input validation to use onChange instead of a pattern since textarea doesn't support pattern

TODO:
1. fix upvoting


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
    sqlUpdate = """update all_posts set upvote = upvote+1 where id = %d"""%(upvoteCount)

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
    title = data['post_title']
    post_body = None
    if data['post_text']:
        post_body = data['post_text']
    elif data['imageSrc']:
        post_body = data['imageSrc']
    elif data['link']:
        post_body = data['link']
    print(post_body)

    print("New post with title %s" %title)
    try:
        sqlInsert = ("""insert into all_posts (title,text,upvote,timestamp) VALUES("%s","%s",1,UNIX_TIMESTAMP())"""%(title,post_body))
        cursor.execute(sqlInsert)
        db.commit()
    except:
        print("error unable to insert post data")
        db.rollback()
        return jsonify('error: unable to insert data'),500
    return jsonify('code: 200'),200
    

@app.route('/api/gethotposts',methods=['GET'])
def get_hot_posts():
    db_con()
    try:
        sqlSelect = "select * from all_posts where log(all_posts.upvote * (UNIX_TIMESTAMP() - all_posts.timestamp) / 45000) >= 0"
        cursor.execute(sqlSelect)
        db.commit()
        new_posts = cursor.fetchall()
    except:
        print("error unable to select post data")
        db.rollback()
        return jsonify('error: unable to select data'),500
    return jsonify(new_posts),200

@app.route('/api/gettopposts',methods=['GET'])
def get_top_posts():
    db_con()
    try:
        sqlSelect = "select * from all_posts order by upvote desc limit 10"
        cursor.execute(sqlSelect)
        db.commit()
        new_posts = cursor.fetchall()
    except:
        print("error unable to select post data")
        db.rollback()
        return jsonify('error: unable to select data'),500
    return jsonify(new_posts),200

@app.route('/api/getnewposts',methods=['GET'])
def get_new_posts():
    db_con()
    try:
        sqlSelect = "select * from all_posts order by id desc limit 10"
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
    file = request.files['file']
    dir = os.path.join("../public/",file.filename)
    file.save(dir)
    resp = "http://192.168.1.4:3000/" + file.filename
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

