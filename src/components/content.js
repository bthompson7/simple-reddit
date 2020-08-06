import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowUp } from "react-icons/fa";
import Cookies from 'universal-cookie';


export default class ContentPage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
         posts:[]
       };

       this.sendUpvote = this.sendUpvote.bind(this);



    }

    componentDidMount(){

        console.log("Attempting to fetch recent posts")
        
        fetch('http://192.168.1.4:3001/api/getposts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }).then(response => response.json())
          .then(function(response){
              console.log(response)
              if(response.error == undefined){
                  console.log("looks good no errors!")
                  this.setState({posts : response})
                  console.log(this.state.posts)

              }else{
                  console.log("error submitting post")
                  alert("Invalid post")
  
              }
          }.bind(this));
    }

    sendUpvote(id) {
        
        const cookies = new Cookies();
        if(!cookies.get('auth')){
            alert("You must be logged in to vote")
        }else{
            console.log(id)
            var json = JSON.stringify(id);
    
            fetch('http://192.168.1.4:3001/api/upvote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: json,
            }).then(response => response.json())
            .then(function(response){
                console.log(response)
                if(response.error == undefined){
                    console.log("good")
                    
                }else{
                    console.log("error submitting upvote")
    
                }
            }.bind(this));
        }
       
      }

    render() {
        return (
        <div>
        {this.state.posts.map(post =>
        (
        <div class="content-page">
         <h5>Title: {post[1]}</h5>
         <h5>Post: {post[2]}</h5>
         <FaArrowUp onClick={() => { this.sendUpvote(post[0])}}/><h5 id="upCount">{post[3]}</h5>

         </div>))
         }
        </div>
        );
    }
  
        
        
}
