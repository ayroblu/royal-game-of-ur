import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import user from './user'
import main from './main'

export default combineReducers({
  user
, main
, router: routerReducer
})
