import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {cn} from '../utils'
import './PlayerArea.css'

class PlayerArea extends Component {
  static propTypes = {
    isOpponent: PropTypes.bool
  , points: PropTypes.number.isRequired
  , player: PropTypes.object
  , waiting: PropTypes.bool
  }
  _renderWaiting(isOpponent){
    return (
      <section className={cn('PlayerArea', isOpponent && 'isOpponent', 'Waiting')}>
        <h2>Waiting for Opponent</h2>
        <p>Send them this url: "<span>{window.location.href}</span>"</p>
      </section>
    )
  }
  render() {
    const {points, isOpponent, waiting, player} = this.props
    if (waiting){
      return this._renderWaiting(isOpponent)
    }
    return (
      <section className={cn('PlayerArea', isOpponent && 'isOpponent')}>
        <h2>Player: {player ? player.name : 'No player name'}</h2>
        {false &&
        <div>
          <h3>Pieces</h3>
          <div className='PiecesPot'>
          </div>
        </div>}
        <div className='points'>Points: {points}</div>
      </section>
    )
  }
}

export default PlayerArea
