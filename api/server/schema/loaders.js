import DataLoader from 'dataloader'

import tempdb from './tempdb'
import db from './db'

const personLoader = new DataLoader(people=>{
  //db.filter(d=>friends.map(f=>f.id).includes(d.id))
  // must? return a promise
  return Promise.resolve(
    people.map(({id, firstName})=>tempdb.find(d=>d.id===id || d.first_name===firstName)))
})
const gameLoader = new DataLoader(games=>{
  return db.getGames(games)
})
const loaders = {
  person: personLoader
, game: gameLoader
}
export default loaders
