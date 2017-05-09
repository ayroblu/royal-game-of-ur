import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './GamePiece.css'
import {cn} from '../utils'

class GamePiece extends Component {
  static propTypes = {
    isOpponent: PropTypes.bool
  , left: PropTypes.number
  , top: PropTypes.number
  }
  render() {
    const {isOpponent, left, top} = this.props
    return (
      <div className={cn('GamePiece', isOpponent && 'isOpponent')} style={{left: `${left}px`, top: `${top}px`}}>
      </div>
    )
  }
}

export default GamePiece
