import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {shallow, mount, render,configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HomePage from './components/homePage';
import Submit from './components/submit';
import Auth from './components/auth-system/auth';

configure({ adapter: new Adapter() })

//test if the App renders properly
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App/>, div);
});

it("App.js contains div", () => {
  const wrapper = mount(<App />);
  const welcome = <div className="App"><Auth/></div>;
  expect(wrapper.contains(welcome)).toEqual(true);
});

describe("", () => {
  it("HomePage handles data passed into it", () => {
    const wrapper = mount(<HomePage data={"testuser123"} />);
    expect(wrapper.props().data).toEqual("testuser123");
  });


});

afterAll(done => {
  done()
})