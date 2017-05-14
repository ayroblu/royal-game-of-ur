import dbconfig from './dbconfig'
import createKnex from 'knex'

const knex = createKnex(dbconfig)
knex.on('query', queryData=>{
  console.log('SQL:',queryData.sql, '----', queryData.bindings)
})

class db{
  static getGames(games){
    const query = knex.select().from('game').orderBy('when_added', 'desc')
    if (games && games.filter(g=>g).length){
      console.log('games', games)
      query.whereIn('game_id', games)
    }
    return query
  }
  static insertGame(game){
    return knex.insert(game).into('game')
  }
  static updateGame(id, game){
    return knex('game').update(game).where('game_id', id)
  }
}
export default db
