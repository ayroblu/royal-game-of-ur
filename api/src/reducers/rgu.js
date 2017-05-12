import { SET, RESET } from '../types/rgu'

const initialState = {
  hasStarted: false
, firstPlayer: null
, secondPlayer: null
, isFirstPlayer: true
, board: null
, playerTurn: 0
, isVictory: false
, lastDieRoll: null
, dieResult: null
, availableMoves: null
, yourId: window.localStorage.getItem('yourId')
}

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case SET:
      return {...state, ...action.payload}
    case RESET:
      return {...initialState, ...action.payload}
    default:
      return state
  }
}
