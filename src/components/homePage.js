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
         submit: false,
         username:"",
         sortByType:""
       };
       this.submitClick = this.submitClick.bind(this);
       this.newClick = this.newClick.bind(this);
       this.topClick = this.topClick.bind(this);
       this.hotClick = this.hotClick.bind(this);


       

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

     hotClick(){
       this.setState({sortByType:"hot"})
     }
 
      newClick(){
      this.setState({sortByType:"new"})

    }
    topClick(){
      this.setState({sortByType:"top"})
    }



    render() {
        const cookies = new Cookies();
        console.log(cookies.get('auth'));
        var isLoggedIn =  cookies.get('auth')

        var renderSubmitPage = this.state.submit;
        var username = cookies.get('username')
        if(renderSubmitPage){
          return(
            <SubmitPage/>
          )
        
      }else{
        return(

          <header id="aboutHeader" className="App-header3">
           
          <h1>Reddit Rewritten</h1>
          <ContentPage sort={this.state.sortByType}/>

          <div class="home-page"> 
          <DropdownButton id="dropdown-item-button" title={username}>
            <Dropdown.Item as="button" onClick={this.submitClick}>Submit A Post</Dropdown.Item>
            <Dropdown.Item as="button" onClick={this.logoutClick}>Logout</Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="dropdown-item-button" title="Sort By">
            <Dropdown.Item as="button" onClick={this.hotClick}>Hot</Dropdown.Item>
            <Dropdown.Item as="button" onClick={this.newClick}>New</Dropdown.Item>
            <Dropdown.Item as="button" onClick={this.topClick}>Top</Dropdown.Item>
          </DropdownButton>
 
      
          </div>
          </header>
          
          
        )

      }

  
        
        
      }

      
    
}
