import React from 'react'
import { Switch, Route,Router,BrowserRouter } from 'react-router-dom'
import Post from './post';
 
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
