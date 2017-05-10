import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {cn} from '../utils'
import './PlayerArea.css'

class PlayerArea extends Component {
  static propTypes = {
    isOpponent: PropTypes.bool
  , points: PropTypes.number.isRequired
  }
  render() {
    const {points, isOpponent} = this.props
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
