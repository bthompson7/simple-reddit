import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/auth-system/register';
import Login from './components/auth-system/login';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom'
import { Router, browserHistory, IndexRoute } from 'react-router'
import Auth from './components/auth-system/auth';

function App() {

  return (
    <div className="App">
     <Auth/>

    </div>
  );
}

export default App;
