import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActions from '../actions/user'
import './Home.css'

class Home extends Component {
  render() {
    return (
      <div className='Home'>
        <h1>Home Page</h1>
        <p>This is a placeholder</p>
        <p>I want this to be a user's dashboard, so list of events and links</p>
      </div>
    )
  }
}

export default connect(state=>({
  user: state.user
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
}))(Home)
