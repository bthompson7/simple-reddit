import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './register';
import Login from './login';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom'
import { Router, browserHistory, IndexRoute } from 'react-router'
import Cookies from 'universal-cookie';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
         login: false,
         register: false,
         auth:false
       };
       this.loginClick = this.loginClick.bind(this);
       this.registerClick = this.registerClick.bind(this);
       

    }


  loginClick() {   
       console.log("login button clicked")
       this.setState(state => ({login: true}));

  }

     registerClick() {   
         console.log("register button clicked")
         this.setState({register:true})
     }

     logoutClick(){
      const cookies = new Cookies();
      cookies.remove('auth');
      window.location.reload()

     }
 

    render() {


        const cookies = new Cookies();
        console.log(cookies.get('auth'));
        var isLoggedIn =  cookies.get('auth')

        

        return(
            
          <header id="aboutHeader" className="App-header3">
          <h1>You are currently logged in</h1>
          <Button variant="primary" size="lg" onClick={this.logoutClick}>Logout</Button>
          </header>
          
        )

        
        
      }

      
    
}
