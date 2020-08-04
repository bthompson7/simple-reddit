import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class ContentPage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
         posts:[]
       };

       

    }

    componentDidMount(){

        console.log("Attempting to fetch recent posts")
        
        fetch('http://localhost:3001/api/getposts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }).then(response => response.json())
          .then(function(response){
              console.log(response)
              if(response.error == undefined){
                  console.log("good")
                  this.setState({posts : response})
                  console.log(this.state.posts)

              }else{
                  console.log("error submitting post")
                  alert("Invalid post")
  
              }
          }.bind(this));
    }

    render() {
        return (
            <div>
        {this.state.posts.map(post => (<div class="content-page"><h3>Title: {post[1]}</h3> <h3>Post: {post[2]}</h3></div>))}
            </div>
        );
    }
  
        
        
}
