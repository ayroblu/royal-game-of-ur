import dbconfig from './dbconfig'
import createKnex from 'knex'

const knex = createKnex(dbconfig)

class db{
  static getGames(games){
    return knex.select().from('game').whereIn(id, games)
  }
}
