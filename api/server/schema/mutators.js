import db from './tempdb'

const personMutator = {
  create(fields){
    console.log(fields)
    return {name: 'hi'}
  }
, update(id, fields){
    console.log(id, fields)
  }
, remove(id){
    console.log(id)
  }
}
const mutators = {
  person: personMutator
}
export default mutators
