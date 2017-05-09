import React, {Component} from 'react'
import PropTypes from 'prop-types'

import GameBlock from './GameBlock'
import './GameBoard.css'

const boardDef = [
  [{reroll: true}, {}, {}, {}, {empty: true}, {empty: true}, {reroll: true}, {}]
, [{}, {}, {}, {reroll: true, invulnerable: true}, {}, {}, {}, {}]
, [{reroll: true}, {}, {}, {}, {empty: true}, {empty: true}, {reroll: true}, {}]
]
class GameBoard extends Component {
  static propTypes = {
  }
  render() {
    return (
      <div className='GameBoard'>
        {boardDef.map(row=>(
        <div className='row'>
          {row.map(b=>(
          <GameBlock {...b} />
          ))}
        </div>
        ))}
      </div>
    )
  }
}

export default GameBoard
