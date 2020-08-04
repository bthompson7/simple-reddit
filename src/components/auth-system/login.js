
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import Cookies from 'universal-cookie';
import HomePage from '../homePage';

export default class Login extends Component {
    constructor(props) {
        super(props);
       this.state = {
         auth:false
       };
       this.handleSubmit = this.handleSubmit.bind(this);

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
            console.log(data.get(name))
          }

          var object = {};
            data.forEach(function(value, key){
         object[key] = value;
         });
            var json = JSON.stringify(object);

        fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            console.log(response)
            if(response.error == undefined){
                console.log("good")
                this.setState({auth:true})
                const cookies = new Cookies();
                console.log("auth good redirecting")
                cookies.set('auth', true, { path: '/' });

                
            }else{
                console.log("error")
                alert("Invalid username or password")

            }
        }.bind(this));
      }


    render() {

        const reg = () => {
            return (


                <div class="form-part">
                <h1>Login to Reddit Rewritten</h1>
         
                <form onSubmit={this.handleSubmit}>
                <label>
                  Name:
                <input type="text" maxlength="20" name="name" required />
                 </label>
                 <label>
                  Password:
                <input type="password" maxlength="40" name="pw" required />
                 </label>
                 <input type="submit" value="Login" />
                  </form>
                <Button href="/">Back</Button>
                </div>      

            )
        }

        const content = () => {
            var isAuth = this.state.auth
            if(isAuth){
                return <HomePage/>
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

  