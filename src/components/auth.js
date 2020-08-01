import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './register';
import Login from './login';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom'
import { Router, browserHistory, IndexRoute } from 'react-router'

export default class Auth extends React.Component {
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
 

    render() {
        const register = () => {
            return (
            <Register/>
            )
         }

         const login = () =>{
             return (
              <Login/>
             )
         }

         const either = () =>{
             return (
            <header class="App-header">
            <h1>Reddit Rewritten</h1>
            <div class="auth">
            <Button variant="primary" size="lg" onClick={this.loginClick}>Login</Button>
            <Button variant="primary" size="lg" onClick={this.registerClick}>Register</Button>

            </div>
            </header>
             )
         }

        const content = () => {
            
            switch(true) {
               case shouldLogin:
                   return login()
                case shouldRegister:
                    return register()
               default:
                    return either()
            }
          }

          var shouldRegister = this.state.register
          var shouldLogin = this.state.login
          var isAuth = this.state.auth

        return(
            
          <header id="aboutHeader" className="App-header3">
           {content()}
          </header>
          
        )

        
        
      }

      
    
}
