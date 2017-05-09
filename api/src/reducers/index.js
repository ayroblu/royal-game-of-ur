import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import user from './user'
import main from './main'
import game from './game'

export default combineReducers({
  user
, main
, game
, router: routerReducer
})
