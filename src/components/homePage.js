import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './auth-system/register';
import Login from './auth-system/login';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom'
import { Router, browserHistory, IndexRoute } from 'react-router'
import Cookies from 'universal-cookie';
import SubmitPage from '../components/submit';
import ContentPage from './content';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
         submit: false
       };
       this.submitClick = this.submitClick.bind(this);

       

    }

     logoutClick(){
      const cookies = new Cookies();
      cookies.remove('auth');
      window.location.reload()

     }

     submitClick(){
      console.log("submit button clicked")
      this.setState({submit:true})
     }
 

    render() {


        const cookies = new Cookies();
        console.log(cookies.get('auth'));
        var isLoggedIn =  cookies.get('auth')

        var renderSubmitPage = this.state.submit;
        if(renderSubmitPage){
          return(
            <SubmitPage/>
          )
        
      }else{
        return(
          <header id="aboutHeader" className="App-header3">
          <h1>Reddit Rewritten</h1>
          <h1>This page is in development. Content will be shown below:</h1>
          <ContentPage/>

          <div class="home-page">
          <Button variant="success" size="lg" onClick={this.submitClick}>Submit</Button>
          <Button variant="danger" size="lg" onClick={this.logoutClick}>Logout</Button>
          </div>
          </header>
          
          
        )

      }

  
        
        
      }

      
    
}
