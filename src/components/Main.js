import React from 'react'
import { Switch, Route,Router,BrowserRouter } from 'react-router-dom'
import Post from './post';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

//<Route path="/" component={() => <Search name={this.props.name} />} />
//        <Route path="/post/:name" component={() => <Footer/>} /> 
 
const Main = () => (
  <main>
 <BrowserRouter>
      <Switch>
        <Route path="/post/:name" component={Post} />
      </Switch>
  </BrowserRouter> 
   </main>
)

export default Main;
