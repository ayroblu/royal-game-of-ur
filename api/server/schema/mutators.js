import db from './db'

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
const gameMutator = {
  create(fields){
    console.log('game create', fields)
    return db.insertGame(fields)
  }
, update(gameId, fields){
    console.log('update game', gameId, fields)
    return db.updateGame(gameId, fields)
  }
, remove(gameId){
    console.log('remove game', gameId)
  }
}
const mutators = {
  person: personMutator
, game: gameMutator
}
export default mutators
