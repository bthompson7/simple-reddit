import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from '../homePage';


export default class Auth extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
         login: false,
         register: false,
         auth:false
       };

    }
 
    render() {

        return(
          <header id="aboutHeader" className="App-header3">
           <HomePage/>
          </header>
          
        )
      }
}
