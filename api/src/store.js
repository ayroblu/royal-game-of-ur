import { createStore, applyMiddleware, compose } from 'redux'
//import createLogger from 'redux-logger'
//import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'

import reducers from './reducers'
import DevTools from './components/DevTools'

//const logger = createLogger()
//const sagaMiddleware = createSagaMiddleware()

const isProduction = process.env.NODE_ENV === 'production'

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  const historyMiddleware = routerMiddleware(history)
  const middlewares = [
  //  sagaMiddleware
  //, logger
    historyMiddleware
  ]

  const enhancers = [
    applyMiddleware(...middlewares)
  , !isProduction ? DevTools.instrument() : null
  ].filter(f=>f)

  const store = createStore(
    reducers
  , initialState
  , compose(...enhancers)
  )

  // Extensions
  //store.runSaga = sagaMiddleware.run
  store.asyncReducers = {} // Async reducer registry

  return store
}
