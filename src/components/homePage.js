import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import SubmitPage from '../components/submit';
import ContentPage from './content';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Register from './auth-system/register';
import Login from './auth-system/login';
import Main from './Main';


export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
         submit: false,
         sortByType:"hot",
         username:"",
         login: false,
         register: false
         
       };
       this.submitClick = this.submitClick.bind(this);
       this.newClick = this.newClick.bind(this);
       this.topClick = this.topClick.bind(this);
       this.hotClick = this.hotClick.bind(this);
       this.loginClick = this.loginClick.bind(this);
       this.registerClick = this.registerClick.bind(this);
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


    loginClick() {   
    this.setState(state => ({login: true}));
    }

    registerClick() {
      this.setState({register:true})
    } 

    render() {
        const cookies = new Cookies();
        var renderSubmitPage = this.state.submit;
        var user = cookies.get("username")
        var isLoggedIn = localStorage.getItem('access_token')

        if(this.state.login && !isLoggedIn){
          return <Login/>
        }

        if(this.state.register && !isLoggedIn){
          return <Register/>
        }


        if(window.location.pathname === "/" && !renderSubmitPage && isLoggedIn){
          return(
            <header id="aboutHeader" className="App-header3">           
          <h1 id="page-title">Reddit Rewritten</h1>
        
          <ContentPage sort={this.state.sortByType}/>

          <div className="home-page"> 
          <DropdownButton  title={user} id="dropdown-item-button">
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
         

        }else if(window.location.pathname === "/" && !isLoggedIn){
          return(
            
          <header id="aboutHeader" className="App-header3">           
          <h1 id="page-title">Reddit Rewritten</h1>
        
          <ContentPage sort={this.state.sortByType}/>

          <div className="home-page"> 
          <DropdownButton id="dropdown-item-button" title="My Account">
            <Dropdown.Item as="button" onClick={this.loginClick}>Login</Dropdown.Item>
            <Dropdown.Item as="button" onClick={this.registerClick}>Register</Dropdown.Item>
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


        if(renderSubmitPage && isLoggedIn){
          return(
            <SubmitPage/>
          )

        
        
      }else{

        return(
          <div>
         <Main/>
         </div>
        )
      } 
      }
}
