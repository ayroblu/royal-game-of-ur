import {
  GraphQLObjectType
, GraphQLInputObjectType
, GraphQLString
, GraphQLList
} from 'graphql'

const type = {
  name: 'Person'
, description: 'These are the people that are in your database'
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
const type2 = {
  name: 'PersonInput'
, description: 'These are the people that are in your database'
, fields: ()=>({
    firstName: {
      type: GraphQLString
    , resolve: ({first_name})=>first_name
    }
  , name: {type: GraphQLString}
  , friends: {
      type: new GraphQLList(PersonInputType)
    , resolve: ({friends}, args, {loaders})=>{
        return loaders.person.loadMany(friends)
        //return db.filter(d=>friends.map(f=>f.id).includes(d.id))
      }
    }
  })
}
export const PersonType = new GraphQLObjectType(type)
export const PersonInputType = new GraphQLInputObjectType(type2)
