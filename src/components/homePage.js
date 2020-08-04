import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import SubmitPage from '../components/submit';
import ContentPage from './content';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

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
          <DropdownButton id="dropdown-item-button" title="Account">
            <Dropdown.Item as="button" onClick={this.submitClick}>Submit A Post</Dropdown.Item>
            <Dropdown.Item as="button" onClick={this.logoutClick}>Logout</Dropdown.Item>
          </DropdownButton>

 
      
          </div>
          </header>
          
          
        )

      }

  
        
        
      }

      
    
}
