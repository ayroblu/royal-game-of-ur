import dbconfig from './dbconfig'
import createKnex from 'knex'

const knex = createKnex(dbconfig)
knex.on('query', queryData=>{
  console.log('SQL:',queryData.sql, '----', queryData.bindings)
})

class db{
  static getGames(games){
    return knex.select().from('game').whereIn('game_id', games)
  }
  static insertGame(game){
    return knex.insert(game).into('game')
  }
  static updateGame(id, game){
    return knex('game').update(game).where('game_id', id)
  }
}
export default db
