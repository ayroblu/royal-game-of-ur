import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {cn} from '../utils'
import './FloatingActionButton.css'

class FloatingActionButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  , onClick: PropTypes.func
  , isActive: PropTypes.bool
  }
  render() {
    const {text, onClick, isActive} = this.props
    return (
      <div className='FloatingActionButton'>
        <p>{text}</p>
        <button className={cn(isActive && 'isActive')} onClick={onClick}>Roll Die</button>
      </div>
    )
  }
}

export default FloatingActionButton
