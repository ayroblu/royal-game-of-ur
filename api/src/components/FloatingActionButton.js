import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './FloatingActionButton.css'

class FloatingActionButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  , onClick: PropTypes.func
  }
  render() {
    const {text, onClick} = this.props
    return (
      <div className='FloatingActionButton'>
        <p>{text}</p>
        <button onClick={onClick}>Next</button>
      </div>
    )
  }
}

export default FloatingActionButton
