import express from 'express'
import graphQLHTTP from 'express-graphql'
import schema from '../schema'
import loaders from '../schema/loaders'
import mutators from '../schema/mutators'

const router = express.Router()
if (process.env.NODE_ENV === 'development'){
  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  })
}

router.use(graphQLHTTP({
  schema
, context: {loaders, mutators}
, graphiql: true
}))

//router.get('/', function(req, res, next) {
//  res.json({})
//})

export default router

