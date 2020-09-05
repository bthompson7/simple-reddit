import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {API_URL} from './Constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowUp } from "react-icons/fa";
import Cookies from 'universal-cookie';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import SubmitPage from '../components/submit';


export default class Footer extends Component {
    constructor(props) {
        super(props);
       this.state = {
         posts:[],
         comments:[],
         resp:"",
         searchString:"",
         error:false,
         submit: false,
         post_id:""

       };

       this.logoutClick = this.logoutClick.bind(this);
       this.sendComment = this.sendComment.bind(this);

    }

    logoutClick(){
        const cookies = new Cookies();
        cookies.remove('username')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = "/"
        window.location.reload()
       }
  
    componentDidMount(){
        var json = JSON.stringify(this.props.match.params.name);

        fetch(API_URL + '/api/getsinglepost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: json,
          }).then(response => response.json())
          .then(function(response){
              if(response.error == undefined){
                this.setState({posts:response})
                this.setState({post_id:response[0][0]})

          var commentJson = JSON.stringify(this.state.post_id);

          fetch(API_URL + '/api/getcomments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: commentJson,
          }).then(response => response.json())
          .then(function(response){
              if(response.error == undefined){
                this.setState({comments:response})

              }else{
                  console.log("error submitting post")
                  alert("Invalid post")
                  this.setState({error:true})
  
              }
          }.bind(this));

              }else{
                  console.log("error submitting post")
                  alert("Invalid post")
                  this.setState({error:true})
  
              }
          }.bind(this));


          
    }


    sendUpvote(id) {
      const cookies = new Cookies();
      var isLoggedIn = localStorage.getItem('access_token')
      console.log("access token is " + isLoggedIn )
      if(!localStorage.getItem('access_token')){
          alert("You must be logged in to vote")
      }else{
          console.log(id)
          var user = cookies.get('username')
          var json = JSON.stringify(id,user);
  
          fetch(API_URL + '/api/upvote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + isLoggedIn },
            body: json,
          }).then(response => response.json())
          .then(function(response){
              console.log(response)
              if(response.error == undefined && response.msg == undefined){
                  console.log("good")

                  //visually change upvotes for the user
                  var changeUpvotes = document.getElementById(id)
                  var num = changeUpvotes.textContent
                  num++;
                  changeUpvotes.textContent = num
                  this.setState({resp:response})

                  
              }else{
                  console.log("error submitting upvote")
                  alert("Missing Authorization Header or Session is invalid please login again")
  
              }
          }.bind(this));
      }
     
    }


  //send comment
  sendComment(event) {
    const cookies = new Cookies();
    var isLoggedIn = localStorage.getItem('access_token')
    var userName = cookies.get('username')

    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    var input = ""

    for (let name of data.keys()) {
        const input = form.elements[name];
        const parserName = input.dataset.parse;
        data.set(name, data.get(name));
      }

      var object = {};
        data.forEach(function(value, key){
     input = value;
     });
    var id = this.state.post_id

     var commentData = {
      'post_id': id,
      'text' : input,
      'user' : userName
    };

    var json = JSON.stringify(commentData);

    console.log("JSON IS " + json)
    if(!localStorage.getItem('access_token')){
        alert("You must be logged in to vote")
    }else{

        fetch(API_URL + '/api/comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + isLoggedIn },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            console.log(response)
            if(response.error == undefined && response.msg == undefined){
                console.log("good") 
                console.log(response)
                window.location.reload()

                
            }else if(response.msg){
                console.log("error submitting comment")
                alert("Missing Authorization Header or Session is invalid please login again")

            }else{
              alert("Error submitting comment")
            }
        }.bind(this));
    }
   
  }

    render() {
        const cookies = new Cookies();
        var user = cookies.get("username")

        if(this.state.submit){
            return(
              <SubmitPage/>
            )

        }
  
          
      const isImage = (postSrc) => {
          console.log(postSrc)
        if(postSrc.includes(".png") || postSrc.includes(".jpg") || postSrc.includes(".jpeg")){
            return <img src={postSrc}></img>
        }else{
            return <h5>{postSrc}</h5>
        }
    }

    

    var isLoggedIn = localStorage.getItem('access_token')

        if(isLoggedIn){
            return(
              <header id="aboutHeader" className="App-header3">           

              <h1>Reddit Rewritten</h1>
                <div className="home-page"> 
              <DropdownButton  title={user} id="dropdown-item-button">
                <Dropdown.Item as="button" onClick={this.logoutClick}>Logout</Dropdown.Item>
              </DropdownButton>
              </div>
    
                {this.state.posts.map(post =>
                    (
                    <div class="content-page">
                    <h5>Posted by {post[3]}</h5>
                    <h5>{post[1]}</h5>
                     {isImage(post[2])}
                     <br></br>
                     <FaArrowUp onClick={() => {this.sendUpvote(post[0])}}/><h5 id={post[0]}>{post[4]}</h5>
                     </div>))
            
                     }   

                  <form onSubmit={this.sendComment}> 
                  
                  <textarea id="submitText" type="text" placeholder="Post text"name="post_text" maxLength="10000" required></textarea>
                  <input id="submitBtn" type="submit" value="Comment" />

                  </form>


                {this.state.comments.map(comment =>
                    (
                    <div class="content-page">
                    <h5>Comment by {comment[5]}</h5>
                    <h5>{comment[1]}</h5>
                    
                     </div>))
            
                     } 


              </header>
            )
        }else{
            return(
                <div>
                {this.state.posts.map(post =>
                    (
                    <div class="content-page">
                    <h5>Posted by {post[3]}</h5>
                    <h5>{post[1]}</h5>
                     {isImage(post[2])}
                     <br></br>
                     <FaArrowUp onClick={() => {this.sendUpvote(post[0])}}/><h5 id={post[0]}>{post[4]}</h5>
                     </div>))
            
                     }  
                     <h3>Login or Sign up to comment</h3>  

                     
                {this.state.comments.map(comment =>
                    (
                    <div class="content-page">
                    <h5>Comment by {comment[5]}</h5>
                    <h5>{comment[1]}</h5>
                    
                     </div>))
            
                     } 
   
              </div>
            )
        }

        
      }
}

