import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './register';
import Login from './login';
import Cookies from 'universal-cookie';
import HomePage from '../homePage';
import ContentPage from '../content';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

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
