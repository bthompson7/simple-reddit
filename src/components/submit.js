import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import {API_URL} from './Constants';
import Cookies from 'universal-cookie';

export default class SubmitPage extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
        value: '',
        imgSrc:'',
        isTitleValid:0,
        isTextValid:0
       };
        this.handlePost = this.handlePost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.isInputValid = this.isInputValid.bind(this);
        this.isValidLink = this.isValidLink.bind(this);

    }

   isInputValid(e){

    var re = new RegExp("^[(?!',.:;/)*a-zA-Z(0-9) ]+$");
    var submit = document.getElementById('submitBtn')
    var count = this.state.isTitleValid
    console.log("count = " + this.state.isTitleValid)

    console.log(re.test(e))
    if (re.test(e) && count > 0) {
      submit.disabled = false
      this.setState({isTitleValid:count-1})
      console.log(this.state.isTitleValid)

    } else if(!re.test(e)) { //doesn't match input
      submit.disabled = true
      this.setState({isTitleValid:count+1})
      console.log(this.state.isTitleValid)
    }
  }

  isTextValid(e){
   var re = new RegExp("^[(?!',.:;/)*a-zA-Z(0-9) ]+$");
   var submit = document.getElementById('submitBtn')
   var count = this.state.isTextValid
   console.log("count = " + this.state.isTextValid)

   console.log(re.test(e))
   if (re.test(e) && count > 0) {
     submit.disabled = false
     this.setState({isTextValid:count-1})
     console.log(this.state.isTextValid)

   } else if(!re.test(e)) { //doesn't match input
     submit.disabled = true
     this.setState({isTextValid:count+1})
     console.log(this.state.isTextValid)
   }
 }


    isValidLink(e){
      var re = new RegExp("^[http://|https://]{1}[www.]?[a-zA-Z0-9]+.[a-zA-Z	0-9]+");
      var submit = document.getElementById('submitBtn')
      console.log(re.test("https://www.google.com"))
      if (re.test(e)) {
        submit.disabled = false
        this.setState({invalidInput:false})

      } else if(!re.test(e)) {
        submit.disabled = true
        this.setState({invalidInput:true})
      }
    }

    handlePost(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        var isLoggedIn = localStorage.getItem('access_token')

        console.log(form)
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

        fetch(API_URL + '/api/newpost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + isLoggedIn  },
          body: json,
        }).then(response => response.json())
        .then(function(response){
            console.log(response)
            if(response.error == undefined && response.msg == undefined){
                console.log("good")
                window.location.reload()
                
            }else{
                console.error("Unable to submit post")
                alert("Missing Authorization Header or Session is invalid please login again")


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
          textElement.hidden = false
          textElement.required = true
          imageElement.hidden = true
          linkElement.hidden = true
        }else if(submitType == "image"){  
        textElement.hidden = true
        textElement.required = false
        imageElement.hidden = false
        linkElement.hidden = true


        }else if(submitType == "link"){
          textElement.hidden = true
          textElement.required = false
          imageElement.hidden = true
          linkElement.hidden = false
        }

         }

         uploadFile(e) {

          e.preventDefault();
          let file = e.target.files[0];
          const formData = new FormData();      
          formData.append("file", file);
        
          axios
            .post(API_URL + "/api/upload/", formData)
            .then(res => this.setState({imgSrc:res['data']}))
            .catch(err => console.warn(err));
            
         }

    render() {
      const cookies = new Cookies();
      var name = cookies.get('username')

      const displayError = () => {
        if(this.state.isTitleValid > 0 || this.state.isTextValid > 0){
         return <Alert variant="danger">Sorry, those characters are not allowed.</Alert>
        }
    }
 
        return(
            
          <header id="aboutHeader" className="App-header3">
          <div class="form-part">       
          <h2>Submit A Post</h2>
            {displayError()}
                <form onSubmit={this.handlePost}>
                <label>
                <input onChange={event => this.isInputValid(event.target.value)} type="text" title="Numbers and letters only" placeholder="Title" maxlength="50" name="post_title" required />
                 </label>
                <select onChange={this.handleChange}>
                    <option value="text" >Text</option>
                    <option value="image" >Image</option>
                    <option value="link" >Link</option>
                </select>
                <label>
                <textarea onChange={event => this.isTextValid(event.target.value)} id="submitText" type="text" placeholder="Post text"name="post_text" maxLength="10000" required></textarea>

                 <input onChange={this.uploadFile} hidden="true" id ="submitImage" type="file" name="myImage" accept="image/*"/>
                 <input hidden="true" value={this.state.imgSrc} name="imageSrc"/>
                 <input hidden="true" value={name} name="postedBy"></input>
                 </label>

                 <input onChange={event => this.isValidLink(event.target.value)} hidden="true" type="url" id="submitLink" name="link" maxlength="255" placeholder="link" required=""/>

                 <input id="submitBtn" type="submit" value="Submit" />
                  </form>
                <Button href="/">Back</Button>
                </div>      
          </header> 
        ) 
      } 
}
