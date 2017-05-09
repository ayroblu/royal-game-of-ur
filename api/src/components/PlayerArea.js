import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './PlayerArea.css'

class PlayerArea extends Component {
  static propTypes = {
    isOpponent: PropTypes.bool
  , points: PropTypes.number.isRequired
  }
  render() {
    const {points} = this.props
    return (
      <section className='PlayerArea'>
        <div>
          Pieces
        </div>
        <div>Points: {points}</div>
      </section>
    )
  }
}

export default PlayerArea
