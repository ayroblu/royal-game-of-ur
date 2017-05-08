import React, { Component } from 'react'
import { withRouter, Link, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from './Home'
import Game from './Game'
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
          <Route exact path="/game/:roomId" component={Game}/>
          <Route component={NoMatch}/>
        </Switch>
        <div>
          <Link to='/game/1'>Game</Link>
        </div>
        <div>
          <Link to='/'>Home</Link>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(state=>({
  user: state.user
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
}))(App))
