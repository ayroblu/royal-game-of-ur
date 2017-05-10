import { SET, RESET } from '../types/game'

const initialState = {
  board: []
, yourPieces: []
, opponentPieces: []
, yourPlayerId: null
, opponentPlayerId: null
, yourPlayerName: null
, opponentPlayerName: null
, boardDims: null
, loading: true
, text: ''
, dieResult: null
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
