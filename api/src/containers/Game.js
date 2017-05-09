import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import GameBoard from '../components/GameBoard'
import PlayerArea from '../components/PlayerArea'
import * as userActions from '../actions/user'
import * as gameActions from '../actions/game'
import * as mainActions from '../actions/main'
import './Game.css'
import {createBoard, createPlayerPieces} from '../utils/game'
import {GraphQLApi} from '../api'

const query = `
query ($id: String!){
  game(id:$id){
    board
  }
}
`
class Game extends Component {
  componentWillMount(){
    const {roomId} = this.props.match.params
    const {token} = this.props.user
    const api = new GraphQLApi({token})
    const variables = JSON.stringify({id: roomId})
    api.runQuery(query, variables).then(res=>{
      if (!res){
        console.log('Invalid query')
        this.props.mainActions.set({errorText: 'Invalid query'})
      } else if (!res.data.game){
        this._initialiseBoard()
      } else {
        console.log('restore')
      }
    }).catch(err=>{
      console.log('Error', err)
      this.props.mainActions.set({errorText: 'Connection error'})
    })
  }
  _initialiseBoard(){
    const board = createBoard()
    const yourPieces = createPlayerPieces()
    const opponentPieces = createPlayerPieces()
    this.props.gameActions.set({board, yourPieces, opponentPieces})
  }
  _getRenderedBoardPos(){
    if (this.props.game.boardDims){
      return
    }
    const cDim = document.querySelector('.GameBoard').getBoundingClientRect()
    const gBlocks = Array.from(document.querySelectorAll('.GameBlock')).map(g=>g.getBoundingClientRect())
    const gDim = _.chunk(gBlocks, 8)
    this.props.gameActions.set({boardDims: gDim, containerDim: cDim})
  }
  _setGameFuncs = ()=>{
    // Start, random pick - who first starts
  }
  _renderLoading(){
    return (
      <div className='Game'>
        Loading
      </div>
    )
  }
  render() {
    const {loading, board, boardDims, containerDim, yourPoints, opponentPoints} = this.props.game
    if (loading) return this._renderLoading()
    setTimeout(()=>this._getRenderedBoardPos())
    return (
      <div className='Game'>
        <PlayerArea points={opponentPoints} isOpponent={true}/>
        <div className='flexGrow'>
          <GameBoard
            board={board}
            setGameBoard={board=>this.props.gameActions.set({board})}
            boardDims={boardDims}
            containerDim={containerDim}
          />
        </div>
        <PlayerArea points={yourPoints}/>
      </div>
    )
  }
}

export default connect(state=>({
  user: state.user
, game: state.game
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
, gameActions: bindActionCreators(gameActions, dispatch)
, mainActions: bindActionCreators(mainActions, dispatch)
}))(Game)
