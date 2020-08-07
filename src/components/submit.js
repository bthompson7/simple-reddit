import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default class SubmitPage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
        value: '',
        imgSrc:''
       };
        this.handlePost = this.handlePost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);



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

        fetch('http://192.168.1.4:3001/api/newpost', {
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
      handleChange(event) { 
        this.setState({value: event.target.value});

        var submitType = event.target.value
        var textElement = document.getElementById('submitText')
        var imageElement = document.getElementById('submitImage')
        var linkElement = document.getElementById('submitLink')

        console.log(submitType)
        if(submitType == "text"){

          console.log("1")

          textElement.hidden = false
          textElement.required = true
          imageElement.hidden = true
          linkElement.hidden = true


        }else if(submitType == "image"){  
      
        console.log("2")

        textElement.hidden = true
        textElement.required = false
        imageElement.hidden = false
        linkElement.hidden = true


        }else if(submitType == "link"){
          console.log("3")
          textElement.hidden = true
          textElement.required = false
          imageElement.hidden = true
          linkElement.hidden = false


        }

         }
         uploadFile(e) {
          e.preventDefault();
          let file = e.target.files[0];
          console.log(file)

          const formData = new FormData();
        
          formData.append("file", file);
        
          axios
            .post("http://192.168.1.4:3001/api/upload/", formData)
            .then(res => this.setState({imgSrc:res['data']}))
            .catch(err => console.warn(err));
        }


    render() {
        
        return(
            
          <header id="aboutHeader" className="App-header3">

          <div class="form-part">       
          <h2>Submit A Post</h2>
                <form onSubmit={this.handlePost}>
                <label>
                <input type="text" pattern="[A-Za-z0-9\s]+" title="Numbers and letters only" placeholder="Title" maxlength="50" name="post_title" required />
                 </label>
                <select onChange={this.handleChange}>
                    <option value="text" >Text</option>
                    <option value="image" >Image</option>
                    <option value="link" >Link</option>
                </select>
                <label>
                <textarea id="submitText" type="text" pattern="[A-Za-z0-9\s]+" title="Numbers and letters only" placeholder="Post text"name="post_text" maxLength="10000" required></textarea>

                 <input onChange={this.uploadFile} hidden="true" id ="submitImage" type="file" name="myImage" accept="image/*"/>
                 <input hidden="true" value={this.state.imgSrc} name="imageSrc"/>
                 </label>

                 <label>
                 <input hidden="true" type="url" id="submitLink" name="link" maxlength="255" placeholder="link" required=""/>
                 </label>

                 <input type="submit" value="Submit" />
                  </form>
                <Button href="/">Back</Button>
                </div>      

          </header>
          
          
        )

        
        
      }

      
    
}
