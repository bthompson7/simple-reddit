'''

main backend for reddit rewritten

Finished:
1. actually display images instead of a link
2. be able to sort posts by new/hot/top
3. Changed input validation to use onChange instead of a pattern since textarea doesn't support pattern
4. Added footer / added indicator to show a post has been upvoted
5. Write more tests / integrate travis ci 
6. fix auth - uses JWT
7. Add a search feature


TODO:

1. Add memcached to help with scaling 
1a. users/login - done
1b. search - done
1c. hot/top posts - TODO

2. fix upvoting 

make it so a user can only upvote a post once
table with id, username
so 1,"testuser123" means testuser123 upvoted post id 1

'''

import os,requests,sys,pymysql,json,re
from regex import Validation
from flask import Flask,render_template,jsonify, request
from twisted.internet import reactor
from twisted.web.proxy import ReverseProxyResource
from twisted.web.resource import Resource
from twisted.web.server import Site
from twisted.web.wsgi import WSGIResource
from flask_cors import CORS
from flask_bcrypt import Bcrypt

#memcache
import memcache

#JWT
from flask_jwt_extended import JWTManager 
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_raw_jwt)

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['JWT_SECRET_KEY'] = 'boost-is-the-secret-of-our-app'
jwt=JWTManager(app)

#input validation
checkInput = Validation()

#setup memcache
memc = memcache.Client(['127.0.0.1:11211'], debug=1)


@app.errorhandler(500)
def page_not_found(e):
    return jsonify(error="Internal Server error"), 500

@app.route('/login',methods=['POST'])
def login():
    data = request.json
    username = data["name"]
    password = data["pw"]
    user = checkInput.isUsernameValid(username)

    if user is False:
        return jsonify(error='Invalid username and/or password'),401

    user = memc.get(username)

    if not user: #search using database and load data into cache
        db_con()
        try:
            print("login cache doesn't exist creating it")
            sqlSelect = """select * from users where username = "%s" """ %(username)
            cursor.execute(sqlSelect)
            db.commit()
            res = cursor.fetchall()
            memc.set(username,res,1800) #1800 seconds is 30 minutes
            check = bcrypt.check_password_hash(res[0][2], password)
            if check is False:
                return jsonify(error='Invalid username and/or password'),401

        except:
            db.rollback()
            print("Error")
            return jsonify(error='Invalid username and/or password'),500

    else: #perform search from cache
        print("searching for user in login cache")
        check = bcrypt.check_password_hash(user[0][2], password)
        if check is False:
            return jsonify(error='Invalid username and/or password'),401
    
    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)
    return jsonify(username,access_token,refresh_token),200


@app.route('/register',methods=['POST'])
def register():
    data = request.json
    username = data["name"]
    password = data["pw"]
    print("Got new user named ", username)

    isUsernameValid = checkInput.isUsernameValid(username)
    if isUsernameValid is False:
        return jsonify(error='Invalid username and/or password'),401

    db_con()

    #create password hash
    pw_hash = bcrypt.generate_password_hash(password)
    pw_hash2 = str(pw_hash.decode("utf-8")) 

    #generate access tokens
    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)

    sqlInsert = ("""INSERT INTO users (username,password) VALUES("%s","%s")"""%(username,pw_hash2))

    try:
        cursor.execute(sqlInsert)
        db.commit()
    except:
        db.rollback()
        print("Error inserting data")
        return jsonify(error='401'),401

    return jsonify(username=username,access_token=access_token,refresh_token=refresh_token),200

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

@app.route('/api/search',methods=['POST'])
def searh():
    data = request.json
    search_for = data
    db_con()
    sqlSelect = """select * from all_posts where title like '%""" + search_for + """%'"""

    allPosts = memc.get('posts')
    cache_results = []

    
    if not allPosts: #cache doesn't exist create it
        print("cache doesn't exist creating it")

        cursor.execute('select * from all_posts')
        db.commit()
        rows = cursor.fetchall()
        memc.set('posts',rows,1800)

        try:
            cursor.execute(sqlSelect)
            db.commit()
            results = cursor.fetchall()
            return jsonify(results),200

        except:
            db.rollback()
            print("Error selecting data")
            return jsonify(error='error selecting data'),500


    else: #perform search using the cache
        print("Using cached posts")
        for row in allPosts:
            if search_for in row[1]:
                cache_results.append(row)
    results = tuple(cache_results)
    return jsonify(results),200







@app.route('/api/newpost',methods=['POST'])
def new_post():
    print("NEW POST!!!!!!!!")
    db_con()
    data = request.json
    print(data)
    title = data['post_title']
    postedBy = data['postedBy']
    print(postedBy)
    post_body = None

    if data['post_text']:
        post_body = data['post_text']
        isTextValid = checkInput.isInputValid(post_body)
        if isTextValid is False:
            print("Invalid username")
            return jsonify(error='Invalid input'),400
    elif data['imageSrc']:
        post_body = data['imageSrc']
    elif data['link']:
        post_body = data['link']
        validLink = checkInput.isLinkValid(post_body)
        if validLink is False:
            print("Invalid link")
            return jsonify(error='Invalid input'),400

    print("New post with title %s" %title)
    try:
        sqlInsert = ("""insert into all_posts (title,text,post_by,upvote,timestamp) VALUES("%s","%s","%s",1,UNIX_TIMESTAMP())"""%(title,post_body,postedBy))
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
        sqlSelect = "select * from all_posts where log(all_posts.upvote * (UNIX_TIMESTAMP() - all_posts.timestamp) / 45000) >= 1"
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
    resp = "http://192.168.1.6:3000/" + file.filename
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

