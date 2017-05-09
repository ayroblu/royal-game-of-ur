import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {cn} from '../utils'
import './GameBlock.css'

class GameBlock extends Component {
  static propTypes = {
    empty: PropTypes.bool
  , reroll: PropTypes.bool
  , invulnerable: PropTypes.bool
  , player: PropTypes.object
  }
  render() {
    const {empty, reroll, invulnerable, player} = this.props
    let text = ''
    if (invulnerable) text+= 'Invulnerable'
    if (invulnerable && reroll) text+= '\n'
    if (reroll) text+= 'Reroll'
    return (
      <div className={cn('GameBlock', !!empty && 'empty', !!reroll && 'reroll', !!invulnerable && 'invulnerable')}>
        <div>{text}</div>
      </div>
    )
  }
}

export default GameBlock
