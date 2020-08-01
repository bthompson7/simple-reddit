
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';


export default class Register extends Component {
    constructor(props) {
        super(props);
       this.state = {
         auth:false
       };
       this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleSubmit(event) {
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

        fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            console.log(response)
            if(response.error == undefined){
                console.log("good")
                this.setState({auth:true})
                console.log("auth good redirecting")
                
            }else{
                console.log("error")
            }
        }.bind(this));
      }


    render() {

        const reg = () => {
            return (


                <div>
                <h1>Register For Reddit Rewritten</h1>
         
                <form onSubmit={this.handleSubmit}>
                <label>
                  Name:
                <input type="text" name="name" required />
                 </label>
                 <label>
                  Password:
                <input type="password" name="pw" required />
                 </label>
                 <input type="submit" value="Submit" />
                  </form>
                <Button href="/">Back</Button>
                </div>      

            )
        }

        const content = () => {
            var isAuth = this.state.auth
            if(isAuth){
                return <h1>Logged in</h1>
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

  