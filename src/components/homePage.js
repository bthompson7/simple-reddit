import React, { Component } from 'react';
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
         sortByType:"hot"
       };
       this.submitClick = this.submitClick.bind(this);
       this.newClick = this.newClick.bind(this);
       this.topClick = this.topClick.bind(this);
       this.hotClick = this.hotClick.bind(this);
    }

     logoutClick(){
      const cookies = new Cookies();
      cookies.remove('username')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.reload()
     }

     submitClick(){
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
        var renderSubmitPage = this.state.submit;
        var user = cookies.get('username')
        if(renderSubmitPage){
          return(
            <SubmitPage/>

            
          )
        
      }else{
        return(
          <header id="aboutHeader" className="App-header3">           
          <h1 id="page-title">Reddit Rewritten</h1>

          <ContentPage sort={this.state.sortByType}/>
          
          <div class="home-page"> 
          <DropdownButton id="dropdown-item-button" title={user}>
            <Dropdown.Item as="button" onClick={this.submitClick}>Submit A Post</Dropdown.Item>
            <Dropdown.Item as="button" onClick={this.logoutClick}>Logout</Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="dropdown-item-button" title={this.state.sortByType + " posts "}>
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
