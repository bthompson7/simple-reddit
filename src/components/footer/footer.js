import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';

export default class Footer extends Component {
    render() {
        return(
          
          <header id="header4" className="footer">
          <div className="footer-container">
          <a href="https://www.github.com/bthompson7/simple-reddit"><i className="fa fab fa-github" href="https://www.github.com"></i></a>
          <a href="https://www.linkedin.com/in/benpthompson"><i className="fa fab fa-linkedin" href="https://www.github.com"></i></a>
          <p>Made using React and Flask</p>
          </div>
          </header>
        )
      }
}

