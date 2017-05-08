import React, { Component } from 'react'
import { withRouter, Link, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from './Home'
import Temp from './Temp'
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
      <div>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/first" component={Temp}/>
          <Route component={NoMatch}/>
        </Switch>
        <Link to='/first'>first</Link>
        <Link to='/'>Home</Link>
      </div>
    )
  }
}

export default withRouter(connect(state=>({
  user: state.user
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
}))(App))
