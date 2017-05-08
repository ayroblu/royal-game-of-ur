import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import configureStore from './store'
import './index.css'
import App from './containers/App'

// Let the reducers handle initial state
const initialState = {}
const store = configureStore(initialState)

const render = Container=>{
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Container />
      </BrowserRouter>
    </Provider>
  , document.getElementById('root')
  )
}
render(App)

if (process.env.NODE_ENV==='development' && module.hot) {
  module.hot.accept('./containers/App', () => {
    const NewApp = require('./containers/App').default
    render(NewApp)
  })
}
