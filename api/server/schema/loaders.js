import DataLoader from 'dataloader'

import db from './tempdb'

const personLoader = new DataLoader(people=>{
  //db.filter(d=>friends.map(f=>f.id).includes(d.id))
  // must? return a promise
  return Promise.resolve(
    people.map(({id, firstName})=>db.find(d=>d.id===id || d.first_name===firstName)))
})
const loaders = {
  person: personLoader
}
export default loaders
