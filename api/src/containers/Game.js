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
import {GameEngine} from '../utils/game'
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
        const game = new GameEngine()
        window.game = game
        this.props.gameActions.set({game})
      } else {
        console.log('restore')
      }
    }).catch(err=>{
      console.log('Error', err)
      this.props.mainActions.set({errorText: 'Connection error'})
    })
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
  _renderLoading(){
    return (
      <div className='Game'>
        Loading
      </div>
    )
  }
  //async _gameEngine(){
  //  const {board, yourPieces, opponentPieces, isYourTurn, isPreGame, yourPlayerId} = this.props.game
  //  if (isPreGame){
  //    const iStart = game.decideStart()
  //    if (iStart){
  //      this.props.gameActions.set({isYourTurn: true, isPreGame: false})
  //    } else {
  //      this.props.gameActions.set({isPreGame: false})
  //    }
  //    // make call here
  //  }
  //  //while (true){
  //  //}
  //  // wait for user to roll dice with action
  //  const diceRoll = game.rollDie()
  //  // show on screen
  //  const diceResult = diceRoll.reduce((a,n)=>a+(n?1:0),0)
  //  const availableMoves = game.getAvailableMoves(board, yourPieces, diceResult, yourPlayerId)
  //  if (!availableMoves.length){
  //    // tell server to opponent's turn
  //    // this.props.gameActions.set({isYourTurn: false})
  //    // continue
  //  }
  //  _.flatten(board).forEach(b=>b.onClick = null)
  //  availableMoves.forEach(m=>{
  //    const c = m.coord
  //    board[c[0]][c[1]].onClick = ()=>{
  //      console.log('make move')
  //      const oldCoord = game.posToCoord(yourPieces[m.id].pos)
  //      board[oldCoord[0]][oldCoord[1]].player = null
  //      yourPieces[m.id].pos = m.pos
  //      board[m.coord[0]][m.coord[1]].player = {id: m.id, playerId}
  //  // board piece has {player:{id: 0, playerId: '', pos: 3, isOpponent: false}}
  //      _.flatten(board).forEach(b=>b.onClick = null)
  //    }
  //  })
  //  function gameMoves(){
  //    //Decide who starts
  //    //loop
  //    //  roll dice
  //    //  move piece
  //    //  check points
  //    //  check victory
  //    //  if (piece lands on reroll) continue
  //    //  switch turns
  //    //endloop
  //  }
  //}
  render() {
    const {
      loading, board, boardDims, containerDim, yourPoints, opponentPoints
    , yourPlayerId, opponentPlayerId
    } = this.props.game
    if (loading) return this._renderLoading()
    setTimeout(()=>this._getRenderedBoardPos())
    return (
      <div className='Game'>
        <PlayerArea points={opponentPoints} isOpponent={true}/>
        <div className='flexGrow'>
          <GameBoard
            {...this.props.game}
            setGameBoard={board=>this.props.gameActions.set({board})}
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
