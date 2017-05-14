import { SET, RESET } from '../types/home'

const initialState = {
  loading: true
, games: []
, nextGame: Math.random().toString(36).substring(2)
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
