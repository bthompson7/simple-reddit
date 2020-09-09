import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {shallow, mount, render,configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HomePage from './components/homePage';
import Auth from './components/auth-system/auth';
import Content from './components/content';
import Footer from './components/footer/footer.js';

configure({ adapter: new Adapter() })
beforeAll(done => {
  done()
})

it('App view renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App/>, div);
});

it('Auth view renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Auth/>, div);
});

it('Footer view renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Footer/>, div);
});

it("App.js contains div", () => {
  const wrapper = mount(<App />);
  const home = <div className="App"><Auth/></div>;
  expect(wrapper.contains(home)).toEqual(true);
});

it("HomePage handles data passed into it", () => {
  const wrapper = mount(<HomePage data={"testuser123"} />);
  expect(wrapper.props().data).toEqual("testuser123");
});


it("Content handles data passed into it", () => {
  const wrapper = mount(<Content sort={"hot"} />);
  expect(wrapper.props().sort).toEqual("hot");
});

afterAll(done => {
  done()
})