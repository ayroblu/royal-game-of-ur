import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import sinon from 'sinon'
import renderer from 'react-test-renderer'

import configureStore from '../store'
import App from './App'

const initialState = {}
const store = configureStore(initialState)
store.dispatch({type: 'HOME/SET', payload: {nextGame: '123'}})

var server
beforeEach(()=>{
  server = sinon.fakeServer.create()
  server.respondWith('POST', '/api', JSON.stringify({data: {games: []}}))
})
afterAll(()=>{
  server.restore()
})
it('renders correctly', async ()=>{
  const tree = renderer.create(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  ).toJSON()
  server.respond()

  //restore native XHR constructor
  await new Promise((y,n)=>setTimeout(y))
  expect(tree).toMatchSnapshot()
})
it('renders without crashing', async ()=>{
  const div = document.createElement('div');

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  , div)

  server.respond()

  //restore native XHR constructor
  await new Promise((y,n)=>setTimeout(y))
  expect(server.requests.length).toEqual(1)
  expect(server.requests[0].url).toEqual('/api')
  expect(server.requests[0].status).toEqual(200)
})
