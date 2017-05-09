export default {
  client: 'pg',
  connection: {
    host : 'rgu-db',
    user : process.env.POSTGRES_USER,
    password : process.env.POSTGRES_PASSWORD,
    database : process.env.POSTGRES_DB
  }
}

