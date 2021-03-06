
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import Cookies from 'universal-cookie';
import HomePage from '../homePage';
import { API_URL } from '../Constants';

export default class Login extends Component {
    constructor(props) {
        super(props);
       this.state = {
         auth:false,
         error:false,
         username:"",
         isUsernameValid:0

       };
       this.handleSubmit = this.handleSubmit.bind(this);

    }

    isInputValid(e){ 
      var re = new RegExp("^[a-zA-Z0-9]+$");
      var submit = document.getElementById('loginBtn')
      var count = this.state.isUsernameValid
      console.log("count = " + this.state.isUsernameValid)
  
      console.log(re.test(e))
      if (re.test(e) && count > 0) {
        submit.disabled = false
        this.setState({isUsernameValid:count-1})
        console.log(this.state.isUsernameValid)
  
      } else if(!re.test(e)) {
        submit.disabled = true
        this.setState({isUsernameValid:count+1})
        console.log(this.state.isUsernameValid)
  
      }
  
    }

    handleSubmit(event) {
        const cookies = new Cookies();
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        var uname;
        var pword;
        for (let name of data.keys()) {
            const input = form.elements[name];
            const parserName = input.dataset.parse;
            data.set(name, data.get(name));
          }

          var object = {};
            data.forEach(function(value, key){
         object[key] = value;
         });
            var json = JSON.stringify(object);

        fetch(API_URL + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            if(response.error === undefined){
                
                this.setState({auth:true})
                this.setState({error:false})

                const cookies = new Cookies();
                cookies.set('username',response[0],{ path: '/',maxAge: 31536000  } )
                localStorage.setItem('access_token', response[1])
                localStorage.setItem('refresh_token',response[2])
                this.setState({username:response[0]})

                //window.location.reload()
                
            }else{
                this.setState({error:true})
            }
        }.bind(this));
      }


    render() {
      var loginError = this.state.error;

      const displayError = () => {  
        if(this.state.isUsernameValid > 0){
         return <Alert variant="danger">Sorry, those characters are not allowed.</Alert>
        }
      }

        const reg = () => {
            return (
                <div class="form-part">
                <h2>Login to Reddit Rewritten</h2>
                <div>{loginError ? <Alert variant="danger">Invalid username and/or password</Alert>: null}</div>
                {displayError()}
                <form onSubmit={this.handleSubmit}>
                <label>
                <input onChange={event => this.isInputValid(event.target.value)} type="text" placeholder="Username" maxlength="20" name="name" required />
                 </label>
                 <label>
                <input type="password" placeholder="Password" maxlength="40" name="pw" required />
                 </label>
                 <input id="loginBtn" type="submit" value="Login" />
                  </form>
                <Button href="/">Back</Button>
                </div>      

            )
        }

        const content = () => {
            var isAuth = this.state.auth
            if(isAuth){
                return <HomePage data={this.state.username}/>
            }else{
                return reg()
            }
          }

        return(

            <div>
            {content()}
            </div>       
            
            )
      }


      
}

  