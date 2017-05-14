import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from './Home'
import Game from './Game'
import NoMatch from '../components/NoMatch'

import * as userActions from '../actions/user'
import * as mainActions from '../actions/main'

class App extends Component {
  _renderLoading(){
    return (
      <div>Loading</div>
    )
  }
  render(){
    if (this.props.main.loading){
      return (
        <div>Loading</div>
      )
    } else if (this.props.main.errorText){
      return (
        <div>Error: {this.props.main.errorText}</div>
      )
    }
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/game/:roomId" component={Game}/>
        <Route component={NoMatch}/>
      </Switch>
    )
  }
}

export default withRouter(connect(state=>({
  user: state.user
, main: state.main
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
, mainActions: bindActionCreators(mainActions, dispatch)
}))(App))
