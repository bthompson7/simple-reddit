import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';

export default class Footer extends Component {
    render() {
      alert("Post id is  " + this.props.match.params.name)
        return(
          
          <header id="header4" className="footer">
          <div>
              <h1>Test</h1>
          </div>
          </header>
        )
      }
}

