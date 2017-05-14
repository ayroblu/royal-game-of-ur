import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import user from './user'
import main from './main'
import game from './game'
import rgu from './rgu'
import home from './home'

export default combineReducers({
  user
, main
, game
, rgu
, home
, router: routerReducer
})
