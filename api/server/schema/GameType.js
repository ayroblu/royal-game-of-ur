import {
  GraphQLObjectType
, GraphQLInputObjectType
, GraphQLString
, GraphQLList
} from 'graphql'

const type = {
  name: 'Game'
, description: 'These are the saved games that are in your database'
, fields: ()=>({
    gameId: {
      type: GraphQLString
    , resolve: ({game_id})=>game_id
    }
  , board: {type: GraphQLString}
  , playerTurn: {
      type: GraphQLString
    , resolve: ({player_turn})=>player_turn
    }
  , firstPlayerId: {
      type: GraphQLString
    , resolve: ({first_player_id})=>first_player_id
    }
  , firstPlayerName: {
      type: GraphQLString
    , resolve: ({first_player_name})=>first_player_name
    }
  , firstPlayerPieces: {
      type: GraphQLString
    , resolve: ({first_player_pieces})=>first_player_pieces
    }
  , secondPlayerId: {
      type: GraphQLString
    , resolve: ({second_player_id})=>second_player_id
    }
  , secondPlayerName: {
      type: GraphQLString
    , resolve: ({second_player_name})=>second_player_name
    }
  , secondPlayerPieces: {
      type: GraphQLString
    , resolve: ({second_player_pieces})=>second_player_pieces
    }
  })
}
export const GameType = new GraphQLObjectType(type)
export const GameInputType = new GraphQLInputObjectType({...type, name: 'GameInput'})

// Games have the whole board + first player + second player piece positions
// points can be determined from the pieces
