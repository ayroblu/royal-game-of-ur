import React, { Component } from 'react'
import { withRouter, Link, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from './Home'
import Game from './Game'
import NoMatch from '../components/NoMatch'

import * as userActions from '../actions/user'
import * as mainActions from '../actions/main'
//import {GraphQLApi} from '../api'

//const query = `
//{
//  person(id:8){
//    firstName
//  }
//}
//`
class App extends Component {
  componentWillMount(){
    //const api = new GraphQLApi()
    //api.runQuery(query).then(res=>{
    //  console.log(res)
    //  this.props.mainActions.set({loading: false})
    //}).catch(err=>{
    //  console.error('Connection error', err)
    //  this.props.mainActions.set({loading: false, errorText: 'Connection error'})
    //})
  }
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
, main: state.main
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
, mainActions: bindActionCreators(mainActions, dispatch)
}))(App))
