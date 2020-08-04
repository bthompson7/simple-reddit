import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './register';
import Login from './login';
import Cookies from 'universal-cookie';
import HomePage from '../homePage';
import ContentPage from '../content';

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
            <header class="App-header3">
            <h1>Reddit Rewritten</h1>
            <ContentPage/>
            <div class="auth">
            <Button variant="primary" size="lg" onClick={this.loginClick}>Login</Button>
            <Button variant="primary" size="lg" onClick={this.registerClick}>Register</Button>

            </div>
            </header>
             )
         }

        const content = () => {
            const cookies = new Cookies();
            console.log(cookies.get('auth'));
            var isLoggedIn =  cookies.get('auth')

            console.log("yep logged in " + isLoggedIn)
            if(isLoggedIn){
                return <HomePage/>
            }

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
