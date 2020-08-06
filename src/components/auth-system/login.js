
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import Cookies from 'universal-cookie';
import HomePage from '../homePage';

export default class Login extends Component {
    constructor(props) {
        super(props);
       this.state = {
         auth:false,
         error:false,
         username:""
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

        fetch('http://192.168.1.4:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            console.log("response is " + response)
            if(response.error == undefined){
                console.log("good")
                this.setState({auth:true})
                const cookies = new Cookies();
                console.log("auth good redirecting")
                cookies.set('auth', true, { path: '/' });
                cookies.set('username',response,{ path: '/' } )
                this.setState({error:false})
                this.setState({username:response})


                
            }else{
                console.log("error")
                //alert("Invalid username or password")
                this.setState({error:true})

            }
        }.bind(this));
      }


    render() {
      var loginError = this.state.error;


        const reg = () => {
            return (


                <div class="form-part">
                <h2>Login to Reddit Rewritten</h2>
                <div>{loginError ? <Alert variant="danger">Invalid username and/or password</Alert>: null}</div>
                <form onSubmit={this.handleSubmit}>
                <label>
                <input type="text" placeholder="Username" maxlength="20" name="name" required />
                 </label>
                 <label>
                <input type="password" placeholder="Password" maxlength="40" name="pw" required />
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

  