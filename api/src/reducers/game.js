import { SET, RESET } from '../types/game'

const initialState = {
  board: []
, yourPieces: []
, opponentPieces: []
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
