import { apiUrl } from './config'

class Api {
  constructor(options){
    this.apiUrl = apiUrl
    this.prefix = ''
    if (!options){
      return
    }
    const {token} = options
    this.token = token
  }
  _getJsonHeaders(){
    return {
      'Accept': 'application/json'
    }
  }
  _postJsonHeaders(){
    return {
      'Accept': 'application/json'
    , 'Content-Type': 'application/json'
    }
  }
  _getAuthedJsonHeaders(){
    if (!this.token){
      return this._postJsonHeaders()
    }
    return {
      'Accept': 'application/json'
    , 'Authorization': 'Bearer ' + this.token
    }
  }
  _postAuthedJsonHeaders(){
    if (!this.token){
      return this._postJsonHeaders()
    }
    return {
      'Accept': 'application/json'
    , 'Content-Type': 'application/json'
    , 'Authorization': 'Bearer ' + this.token
    }
  }
  setToken(token){
    this.token = token
  }
  _handleStatus(res){
    // http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
    // 401- no token/invalid token for something that needs auth
    // 403- have token, but that's still not something you're allowed to touch
    if (res.ok){
      return res.json()
    } else if (res.status === 401) {
      setTimeout(()=>{
        // logout - run after error is thrown and caught
      })
      throw new Error('Your login is invalid')
    } else if (res.status === 403) {
      return
    } else if (res.status >= 500) {
      throw new Error('Server had an issue')
    }
    return
  }
  _buildQueryString(data){
    return '?' + Object.keys(data).map(d=>d+'='+encodeURIComponent(data[d]))
  }
}

export class GraphQLApi extends Api{
  constructor(options){
    super(options)
    this.prefix = '/api'
  }
  runQuery(query, variables){
    return fetch(this.apiUrl + this.prefix, {
      method: 'POST'
    , headers: this._postAuthedJsonHeaders()
    , body: JSON.stringify({query, variables})
    }).then(this._handleStatus)
  }
}
