import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from './Home'
import NoMatch from '../components/NoMatch'

import * as userActions from '../actions/user'
import {GraphQLApi} from '../api'

const mainQuery = `
{
  person(id:1){
    firstName
  }
}
`
class App extends Component {
  componentWillMount(){
    const api = new GraphQLApi()
    api.runQuery(mainQuery).then(res=>{
      console.log(res)
    }).catch(err=>{
      console.error('Connection error', err)
    })
  }
  render(){
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route component={NoMatch}/>
      </Switch>
    )
  }
}

export default connect(state=>({
  user: state.user
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
}))(App)
