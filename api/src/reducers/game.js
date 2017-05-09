import { SET, RESET } from '../types/game'

const initialState = {
  board: []
, yourPieces: []
, opponentPieces: []
, boardDims: null
, yourPoints: 0
, opponentPoints: 0
, isYourTurn: false
, loading: true
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
