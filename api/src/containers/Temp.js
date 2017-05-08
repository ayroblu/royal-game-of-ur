import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActions from '../actions/user'

class Temp extends Component {
  render() {
    return (
      <div className='Temp'>
        Temp
      </div>
    )
  }
}

export default connect(state=>({
  user: state.user
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
}))(Temp)
