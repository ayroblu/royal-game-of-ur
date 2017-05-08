import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActions from '../actions/user'
import './Game.css'

class Game extends Component {
  render() {
    return (
      <div className='Game'>
        <h1>Game Page</h1>
      </div>
    )
  }
}

export default connect(state=>({
  user: state.user
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
}))(Game)
