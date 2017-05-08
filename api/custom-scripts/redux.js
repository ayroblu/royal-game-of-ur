var fs = require('fs');
var path = require('path');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Please provide the name of your action / reducer as an argument');
  process.exit()
}

const name = args[0]
if (/[^a-z0-9]/i.test(name)){
  console.log('Please make sure your name only contains alphanumeric characters');
  process.exit()
}

const typeFileName = path.resolve(__dirname, '..', 'src', 'types', `${name}.js`)
const type = `
const prefix = '${name.replace(/([A-Z])/g, '_$1').toUpperCase()}/'

export const SET = prefix + 'SET'
export const RESET = prefix + 'RESET'
`.trim()

const actionFileName = path.resolve(__dirname, '..', 'src', 'actions', `${name}.js`)
const action = `
import { SET, RESET } from '../types/${name}'

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
`.trim()

const reducerFileName = path.resolve(__dirname, '..', 'src', 'reducers', `${name}.js`)
const reducer = `
import { SET, RESET } from '../types/${name}'

const initialState = {
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
`.trim()
console.log('Make sure you change the reducer/index file!', path.resolve(__dirname, '..', 'src', 'reducers', `index.js`))

//console.log('Redux: action:', actionFileName)
//console.log(action)
//console.log('reducer:', reducerFileName)
//console.log(reducer)
//console.log('type:', typeFileName)
//console.log(type)

fs.writeFileSync(typeFileName, type)
fs.writeFileSync(actionFileName, action)
fs.writeFileSync(reducerFileName, reducer)

console.log('Finished!')
