const config = require('./config')
const knex = require('knex')(config)
knex.on('query', queryData=>{
  console.log('SQL:',queryData.sql, '----', queryData.bindings)
})

module.exports = {
  findImage(imageId){
    const columns = [
      'image_id', 'image', 'name', 'mimetype', 'width', 'height'
    ]
    return knex.select(columns).from('image').where('image_id', imageId)
  }
}
