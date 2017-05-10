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
    board: {type: GraphQLString}
  , firstPlayerPieces: {
      type: GraphQLString
    , resolve: ({first_player_pieces})=>first_player_pieces
    }
  , secondPlayerPieces: {
      type: GraphQLString
    , resolve: ({second_player_pieces})=>second_player_pieces
    }
  , firstPlayerIp: {
      type: GraphQLString
    , resolve: ({first_player_ip})=>first_player_ip
    }
  , secondPlayerIp: {
      type: GraphQLString
    , resolve: ({second_player_ip})=>second_player_ip
    }
  })
}
export const GameType = new GraphQLObjectType(type)

// Games have the whole board + first player + second player piece positions
// points can be determined from the pieces
