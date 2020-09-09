import React from "react";
import { Link,Route,Router,BrowserRouter } from "react-router-dom";

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul>
        <li>
          <BrowserRouter>
          <Link to="/post">Home</Link>
          </BrowserRouter>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
