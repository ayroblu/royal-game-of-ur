import {
  GraphQLSchema
, GraphQLObjectType
, GraphQLString
, GraphQLInt
, GraphQLNonNull
, GraphQLList
} from 'graphql'
import {snakeCaseObject} from '../utils/rename'

import {PersonType, PersonInputType} from './PersonType'
import {GameType, GameInputType} from './GameType'

const QueryType = new GraphQLObjectType({
  name: 'Query'
, description: 'This is a query'
, fields: ()=>({
    person: {
      type: PersonType
    , description: 'Get yourself a person'
    , args: {
        id: {type: GraphQLInt}
      , firstName: {type: GraphQLString}
      }
    , resolve: (root, person, {loaders}, ast)=>{
        console.log('fields:', JSON.stringify(
          ast.fieldASTs.map(
            f=>f.selectionSet.selections.map(s=>s.name.value)), null, 2))
        return loaders.person.load(person)
      }
    }
  , game: {
      type: GameType
    , description: 'Get a saved game'
    , args: {
        id: {type: GraphQLString}
      }
    , resolve: (root, game, {loaders}, ast)=>{
        return loaders.game.load(game)
      }
    }
  })
})
const MutationType = new GraphQLObjectType({
  name: 'Mutation'
, description: 'This is a mutation'
, fields: ()=>({
    createPerson: {
      type: PersonType
    , description: 'Creates a person'
    , args: {
        firstName: {type: GraphQLString}
      , name: {type: GraphQLString}
      , friends: {type: new GraphQLList(PersonInputType)}
      }
    , resolve: (root, person, {mutators}, ast)=>{
        return mutators.person.create(person)
      }
    }
  , createGame: {
      type: GameType
    , description: 'Creates a game'
    , args: {
        game: {type: GameInputType}
      }
    , resolve: (root, {game}, {mutators}, ast)=>{
        return mutators.game.create(snakeCaseObject(game))
      }
    }
  , updateGame: {
      type: GameType
    , description: 'Updates a game'
    , args: {
        gameId: {type: new GraphQLNonNull(GraphQLString)}
      , game: {type: GameInputType}
      }
    , resolve: (root, {gameId, game}, {mutators}, ast)=>{
        return mutators.game.update(gameId, snakeCaseObject(game))
      }
    }
  })
})

export default new GraphQLSchema({
  query: QueryType
, mutation: MutationType
})
