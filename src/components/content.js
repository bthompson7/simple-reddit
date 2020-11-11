import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowUp } from "react-icons/fa";
import Cookies from 'universal-cookie';
import Footer from '../components/footer/footer.js'
import {API_URL} from './Constants';
import Button from 'react-bootstrap/Button';
import { BrowserRouter, Route,Router, Switch,Link } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import Modal from 'react-bootstrap/Modal';
import Login from './auth-system/login.js';

export default class ContentPage extends React.Component {
       state = {
         posts:[],
         resp:"",
         searchString:"",
         upvoteError:false,
         sortByPosts: "",
         prevSort:""
       };

  
       static getDerivedStateFromProps(props,state){ //getDerivedStateFromProps //componentWillReceiveProps //componentDidUpdate
        if (props.sort !== state.sortByPosts) {      
            return {       
                 sortByPosts: props.sort 
                }; 
          }
        // Return null to indicate no change to state.
        return null;
      }


      
      // this.sendUpvote = this.sendUpvote.bind(this);
       //this.changeSortByType = this.changeSortByType.bind(this);
    

    componentDidMount(){
        fetch(API_URL + '/api/gethotposts', {
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

    changeSortByType(sortBy){

        console.log("CHANGE SORT BY TYPE")
        const cookies = new Cookies();


        //if(localState != propsState){

        console.log("PROPS = " + sortBy)

        cookies.set('sortBy', sortBy, { path: '/' });

        fetch(API_URL + '/api/get' + sortBy +'posts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }).then(response => response.json())
          .then(function(response){
              console.log(response)
              if(response.error == undefined){
                  this.setState({posts : response})

              }else{
                  console.log("error submitting post")
                  alert("Invalid post")
  
              }
          }.bind(this));
        //}
    }


    getInput(e){ 
        const searchValue = e.target.value;
        this.setState({searchString:searchValue})
      }
   


    search(title) {
        var json = JSON.stringify(title);
            fetch(API_URL + '/api/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: json,
            }).then(response => response.json())
            .then(function(response){
                console.log(response)
                if(response.error == undefined){
                    this.setState({posts:response})
                    
                }else{
                    console.log("error submitting upvote")
    
                }
            }.bind(this));
    }

    sendUpvote(id) {
        const cookies = new Cookies();
        var isLoggedIn = localStorage.getItem('access_token')
        console.log("access token is " + isLoggedIn )
        if(!localStorage.getItem('access_token')){
            alert("You must be logged in to vote") //repalce with bootstrap toast or modal

            this.setState({upvoteError:true})
            
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


      componentDidUpdate(state,prevProps,prevState){

        if(this.state.prevSort !== this.state.sortByPosts){
            console.log("Component Updated")
            console.log(this.state.sortByPosts)
  
            this.changeSortByType(this.state.sortByPosts)
            this.setState({prevSort:this.state.sortByPosts})
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


        <div className="main-div">
            <div className="search-div">
        <input required=''placeholder="Search" id="search" onChange={event => this.getInput(event)}></input>
        <Button onClick={() => {this.search(this.state.searchString)}}>Search</Button>
        </div>
        
        {this.state.posts.map(post =>
                (
                <div class="content-page">
                <h5>Posted by {post[3]}</h5>
                <h5>{post[1]}</h5>
                 {isImage(post[2])}
                 <br></br>
                 <FaArrowUp onClick={() => {this.sendUpvote(post[0])}}/><h5 id={post[0]}>{post[4]}</h5>
                 <BrowserRouter>
                    <Link target="_blank" to={"/post/" + post[0]}>View Comments</Link>
                 </BrowserRouter>
                 </div>))
        
                 }        
            <Footer/>
        </div>
        );
    }      
}
