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
8. Add memcached to help with scaling 
8a. users/login - done
8b. search - done
8c. hot/top posts - done


TODO:

1. Add comments
1a. display single posts - done
1b. display comments 

2. fix upvoting 

make it so a user can only upvote a post once
table with id, username
so 1,"testuser123" means testuser123 upvoted post id 1

'''

import os,requests,sys,pymysql,json,re,datetime
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

#JWT docs - https://flask-jwt-extended.readthedocs.io/en/stable/basic_usage/
app.config['JWT_SECRET_KEY'] = 'boost-is-the-secret-of-our-app'
jwt = JWTManager(app)

#input validation
checkInput = Validation()

#setup memcache server
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
    expires = datetime.timedelta(days=365)
    access_token = create_access_token(identity=username,expires_delta=expires)
    refresh_token = create_refresh_token(identity=username,expires_delta=expires)
    return jsonify(username,access_token,refresh_token),200


@app.route('/register',methods=['POST'])
def register():
    data = request.json
    username = data["name"]
    password = data["pw"]

    isUsernameValid = checkInput.isUsernameValid(username)
    if isUsernameValid is False:
        return jsonify(error='Invalid username and/or password'),401
    print("Got new user named ", username)

    db_con()

    #create password hash
    pw_hash = bcrypt.generate_password_hash(password)
    pw_hash2 = str(pw_hash.decode("utf-8")) 

    #generate access tokens
    expires = datetime.timedelta(days=365)
    access_token = create_access_token(identity=username,expires_delta=expires)
    refresh_token = create_refresh_token(identity=username,expires_delta=expires)

    sqlInsert = ("""INSERT INTO users (username,password) VALUES("%s","%s")"""%(username,pw_hash2))

    try:
        cursor.execute(sqlInsert)
        db.commit()
    except:
        db.rollback()
        print("Error inserting data")
        return jsonify(error='401'),401

    return jsonify(username,access_token,refresh_token),200

@app.route('/api/comment',methods=['POST'])
@jwt_required
def comment():
    data = request.json
    #{'post_id': 6, 'text': 'aaaa', 'user': 'testuser123'}
    print(data['post_id'])
    text = data['text']
    post_id = data['post_id']
    comment_by = data['user']
    current_user = get_jwt_identity()
    print(current_user + " just commented on a post")


    db_con()
    sqlInsert = ("""insert into comments (comment_text,post_id,comment_by) VALUES("%s","%s","%s")"""%(text,post_id,comment_by))
    try:
        cursor.execute(sqlInsert)
        db.commit()
    except:
        db.rollback()
        print("Error updating data")
        return jsonify(error='error updating data'),500
    return jsonify("ok"),200

@app.route('/api/getcomments',methods=['POST'])
def comments():
    db_con()
    try:
        data = request.json
        sqlSelect = "select * from comments where post_id = %s "%(data)
        cursor.execute(sqlSelect)
        db.commit()
        post_comments = cursor.fetchall()
    except:
        print("error unable to select post data")
        db.rollback()
        return jsonify(error='unable to select data'),500
    return jsonify(post_comments),200

@app.route('/api/upvote',methods=['POST'])
@jwt_required
def upvote():
    data = request.json
    upvoteCount = data
    current_user = get_jwt_identity()
    print(current_user + " just upvoted a post")
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
def search():
    data = request.json
    search_for = data
    db_con()
    print("search for %s" %data)
    sqlSelect = """select * from all_posts where title like '%""" + search_for + """%'"""
    sqlCacheSelect = "select * from all_posts"

    allPosts = memc.get('posts')
    cache_results = []

    
    if not allPosts: #cache doesn't exist create it and perform search using the database
        print("search cache doesn't exist creating it")
        db_con()
        cursor.execute(sqlCacheSelect)
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
@jwt_required
def new_post():
    db_con()
    current_user = get_jwt_identity()
    print(current_user)
    data = request.json
    title = data['post_title']
    postedBy = data['postedBy']
    print("New post with title %s" %title)
    print(data)
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

    hotPosts = memc.get('hotPosts')

    if not hotPosts: #cache doesn't exist creating it and perform search using database
        print("Hot posts cache doesn't exist creating it")
        db_con()
        try:
            sqlSelect = "select * from all_posts where log(all_posts.upvote * (UNIX_TIMESTAMP() - all_posts.timestamp) / 45000) >= 1 AND log(all_posts.upvote * (UNIX_TIMESTAMP() - all_posts.timestamp) / 45000) <= 10"
            cursor.execute(sqlSelect)
            db.commit()
            hot_posts = cursor.fetchall()
            memc.set('hotPosts',hot_posts,1800)
            return jsonify(hot_posts),200
        except:
            print("error unable to select post data")
            db.rollback()
            return jsonify('error: unable to select data'),500
    else:   #use cache
        print("Using hot posts cache")
        posts = memc.get('hotPosts')
        return jsonify(posts),200

@app.route('/api/gettopposts',methods=['GET'])
def get_top_posts():
    topPosts = memc.get('topPosts')

    if not topPosts:#cache doesn't exist creating it and perform search using database
        print("Creating top posts cache")
        db_con()
        try:
            sqlSelect = "select * from all_posts order by upvote desc limit 20"
            cursor.execute(sqlSelect)
            db.commit()
            top_posts = cursor.fetchall()
            memc.set('topPosts',top_posts,1800)
            return jsonify(top_posts),200
        except:
            print("error unable to select post data")
            db.rollback()
            return jsonify('error: unable to select data'),500
    else: #use cache
        print("Using top posts cache")  
        posts = memc.get('topPosts')
        return jsonify(posts),200

@app.route('/api/getsinglepost',methods=['POST'])
def get_single_post():
    db_con()
    try:
        data = request.json
        post_id = data
        sqlSelect = "select * from all_posts where id = %s "%(post_id)
        cursor.execute(sqlSelect)
        db.commit()
        post_info = cursor.fetchall()
    except:
        print("error unable to select post data")
        db.rollback()
        return jsonify(error='unable to select data'),500
    return jsonify(post_info),200

@app.route('/api/getnewposts',methods=['GET'])
def get_new_posts():
    db_con()
    try:
        sqlSelect = "select * from all_posts order by id desc limit 20"
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

