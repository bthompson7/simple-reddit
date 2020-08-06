
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
import HomePage from '../homePage';
import Alert from 'react-bootstrap/Alert'


export default class Register extends Component {
    constructor(props) {
        super(props);
       this.state = {
         auth:false,
         error:false
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

        fetch('http://192.168.1.4:3001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            console.log(response)
            if(response.error == undefined){ //if we don't we an error we are good!
                this.setState({auth:true})
                console.log("auth good redirecting")
                this.setState({error:false})
                cookies.set('auth', true, { path: '/' });
                
            }else{
                console.log("error")
                //alert("Username already exists try a different one")
                this.setState({error:true})

            }
        }.bind(this));
      }


    render() {
      var registerError = this.state.error;

        const reg = () => {
            return (


                <div class="form-part">
                <h2>Register For Reddit Rewritten</h2>
                <div>{registerError ? <Alert variant="danger">That username already exists!</Alert>: null}</div>

                <form onSubmit={this.handleSubmit}>
                <label>
                <input type="text" placeholder="Username" maxlength="20" name="name" required />
                 </label>
                 <label>
                <input type="password" placeholder="Password" maxlength="40" name="pw" required />
                 </label>
                 <input type="submit" value="Register" />
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

  