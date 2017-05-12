import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import user from './user'
import main from './main'
import game from './game'
import rgu from './rgu'

export default combineReducers({
  user
, main
, game
, rgu
, router: routerReducer
})
