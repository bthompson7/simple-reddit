import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SubmitPage extends React.Component {
    constructor(props) {
        super(props);
       
        this.handlePost = this.handlePost.bind(this);

    }

    handlePost(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        var title;
        var text;
        console.log(form)
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

        fetch('http://localhost:3001/api/newpost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            console.log(response)
            if(response.error == undefined){
                console.log("good")
                window.location.reload()
                
            }else{
                console.log("error submitting post")
                alert("Invalid post")

            }
        }.bind(this));
      }



    render() {
        
        return(
            
          <header id="aboutHeader" className="App-header3">
          <h1>Submit A Post</h1>

          <div class="form-part">         
                <form onSubmit={this.handlePost}>
                <label>
                  Title:
                <input type="text" maxlength="50" name="post_title" required />
                 </label>
                 <label>
                Post Text:
                <textarea type="text" name="post_text" maxLength="10000" required ></textarea>
                 </label>
                 <input type="submit" value="Submit" />
                  </form>
                <Button href="/">Back</Button>
                </div>      

          </header>
          
          
        )

        
        
      }

      
    
}
