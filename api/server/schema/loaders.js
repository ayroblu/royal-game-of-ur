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
  return Promise.resolve(db.getGames(games.map(g=>g.id))).then(r=>{
    if (r.length !== games.length) return Array(games.length).fill().map(a=>null)
    return r
  })
})
const loaders = {
  person: personLoader
, game: gameLoader
}
export default loaders
