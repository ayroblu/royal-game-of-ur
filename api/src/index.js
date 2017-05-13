import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'

import configureStore from './store'
import './index.css'
import App from './containers/App'
import DevTools from './components/DevTools'
import {hotReload} from './config'

// Let the reducers handle initial state
const initialState = {}
const history = createHistory()
const store = configureStore(initialState, history)
const isProduction = process.env.NODE_ENV === 'production'

const render = Container=>{
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <ConnectedRouter history={history}>
          <Container />
        </ConnectedRouter>
        {!isProduction && <DevTools />}
      </div>
    </Provider>
  , document.getElementById('root')
  )
}
render(App)

if (hotReload && module.hot) {
  module.hot.accept('./containers/App', () => {
    console.clear()
    const NewApp = require('./containers/App').default
    render(NewApp)
  })
}
