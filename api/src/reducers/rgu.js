import { SET, RESET } from '../types/rgu'

const initialState = {
  hasStarted: false
, firstPlayer: null
, secondPlayer: null
, isFirstPlayer: true
, board: null
, playerTurn: 0
, victor: null
, lastDieRoll: null
, dieResult: null
, availableMoves: null
, yourId: window.localStorage && window.localStorage.getItem('yourId')
, yourPoints: 0
, opponentPoints: 0
, text: ''
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
