const _ = require('lodash')

function toCamelCase(s){
  return s.replace(/(_[a-z])/g, t=>t.toUpperCase().replace('_',''));
}
function toSnakeCase(s){
  return s.replace(/([A-Z])/g, t=>"_"+t.toLowerCase())
}
function camelCaseObject(object){
  return Object.keys(object).reduce((o, k)=>{
    o[toCamelCase(k)] = object[k]
    if (_.isPlainObject(object[k])){
      o[toCamelCase(k)] = camelCaseObject(object[k])
    }
    return o
  }, {})
}
function snakeCaseObject(object){
  return Object.keys(object).reduce((o, k)=>{
    o[toSnakeCase(k)] = object[k]
    return o
  }, {})
}
module.exports = {
  camelCaseObject
, snakeCaseObject
}
