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
    firstName: {
      type: GraphQLString
    , resolve: ({first_name})=>first_name
    }
  , name: {type: GraphQLString}
  , friends: {
      type: new GraphQLList(PersonType)
    , resolve: ({friends}, args, {loaders})=>{
        return loaders.person.loadMany(friends)
        //return db.filter(d=>friends.map(f=>f.id).includes(d.id))
      }
    }
  })
}
export const GameType = new GraphQLObjectType(type)

