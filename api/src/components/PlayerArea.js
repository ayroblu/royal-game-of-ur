import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {cn} from '../utils'
import './PlayerArea.css'

class PlayerArea extends Component {
  static propTypes = {
    isOpponent: PropTypes.bool
  , points: PropTypes.number.isRequired
  , waiting: PropTypes.bool
  }
  _renderWaiting(isOpponent){
    return (
      <section className={cn('PlayerArea', isOpponent && 'isOpponent')}>
        <h2>Waiting for Opponent</h2>
      </section>
    )
  }
  render() {
    const {points, isOpponent, waiting} = this.props
    if (waiting){
      return this._renderWaiting(isOpponent)
    }
    return (
      <section className={cn('PlayerArea', isOpponent && 'isOpponent')}>
        <div>
          <h2>Pieces</h2>
          <div className='PiecesPot'>
          </div>
        </div>
        <div className='points'>Points: {points}</div>
      </section>
    )
  }
}

export default PlayerArea
