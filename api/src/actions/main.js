import { SET, RESET } from '../types/main'

export function set(payload){
  return {
    type: SET
  , payload
  }
}

export function reset(payload={}){
  return {
    type: RESET
  , payload
  }
}