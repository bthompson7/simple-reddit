import React from 'react'
import { Switch, Route,Router,BrowserRouter } from 'react-router-dom'
import Footer from './footer/footer'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
 <BrowserRouter>
      <Switch>
        <Route path="/post" component={Footer} />
      </Switch>
  </BrowserRouter> 
   </main>
)

export default Main;
