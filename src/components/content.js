import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowUp } from "react-icons/fa";
import Cookies from 'universal-cookie';
import Footer from '../components/footer/footer.js'

export default class ContentPage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
         posts:[],
         resp:""
       };
       this.sendUpvote = this.sendUpvote.bind(this);
    }

    componentDidMount(){
        fetch('http://192.168.1.4:3001/api/gethotposts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }).then(response => response.json())
          .then(function(response){
              if(response.error == undefined){
                  console.log("looks good no errors!")
                  this.setState({posts : response})

              }else{
                  console.log("error submitting post")
                  alert("Invalid post")
  
              }
          }.bind(this));
    }


    componentWillReceiveProps(props){
        const cookies = new Cookies();

        console.log(this.state.sortByPosts)
        cookies.set('sortBy', props.sort, { path: '/' });

        fetch('http://192.168.1.4:3001/api/get' + props.sort +'posts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }).then(response => response.json())
          .then(function(response){
              console.log(response)
              if(response.error == undefined){
                  console.log("looks good no errors!")
                  this.setState({posts : response})

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
            var user = cookies.get('username')
            var json = JSON.stringify(id,user);
    
            fetch('http://192.168.1.4:3001/api/upvote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: json,
            }).then(response => response.json())
            .then(function(response){
                console.log(response)
                if(response.error == undefined){
                    console.log("good")
                    
                    //visually change upvotes for the user
                    var changeUpvotes = document.getElementById(id)
                    var num = changeUpvotes.textContent
                    num++;
                    changeUpvotes.textContent = num
                    this.setState({resp:response})
                    
                }else{
                    console.log("error submitting upvote")
    
                }
            }.bind(this));
        }
       
      }

    render() {

        const isImage = (postSrc) => {
            if(postSrc.includes(".png") || postSrc.includes(".jpg") || postSrc.includes(".jpeg")){
                return <img src={postSrc}></img>
            }else{
                return <h5>{postSrc}</h5>
            }
        }

        return (
        <div>
        {this.state.posts.map(post =>
        (
        <div class="content-page">
        <h5>Post Id: {post[0]}</h5>
         <h5>Title: {post[1]}</h5>
         {isImage(post[2])}
         <br></br>
         <FaArrowUp onClick={() => {this.sendUpvote(post[0])}}/><h5 id={post[0]}>{post[3]}</h5>
         </div>))

         }
         <Footer/>
        </div>
        );
    }      
}
