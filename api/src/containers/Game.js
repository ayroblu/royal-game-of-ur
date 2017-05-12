import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import socket from '../utils/socket'
import RoyalGameOfUr from './RoyalGameOfUr'
import GameBoard from '../components/GameBoard'
import PlayerArea from '../components/PlayerArea'
import FloatingActionButton from '../components/FloatingActionButton'
import * as userActions from '../actions/user'
import * as gameActions from '../actions/game'
import * as mainActions from '../actions/main'
import * as rguActions from '../actions/rgu'
import './Game.css'
import {GraphQLApi} from '../api'

const query = `
query ($id: String!){
  game(id:$id){
    gameId
    playerTurn
    board
    firstPlayerId
    firstPlayerName
    firstPlayerPieces
    secondPlayerId
    secondPlayerName
    secondPlayerPieces
  }
}
`

const addQuery = `
mutation CreateGame($game: GameInput!){
  createGame(game: $game){
    gameId
  }
}
`
const updateQuery = `
mutation UpdateGame($gameId: String!, $game: GameInput!){
  updateGame(gameId: $gameId, game: $game){
    gameId
  }
}
`
class Game extends Component {
  componentWillMount(){
    this.props.gameActions.reset()
    const {roomId} = this.props.match.params
    const {token} = this.props.user
    const api = new GraphQLApi({token})
    const variables = JSON.stringify({id: roomId})
    api.runQuery(query, variables).then(res=>{
      console.log('first res', res)
      if (!res){
        console.log('Invalid query')
        this.props.mainActions.set({errorText: 'Invalid query'})
      } else if (!res.data.game){
        //this._initialiseGame()
      } else {
        this._restore(res.data.game)
      }
    }).catch(err=>{
      console.log('Error', err)
      this.props.mainActions.set({errorText: 'Connection error'})
    })
  }
  _initialiseGame(){
    console.log('initialise')
    this.socket = socket(this._game)

    const {roomId: gameId} = this.props.match.params
    const {id: firstPlayerId, name: firstPlayerName, pieces: firstPlayerPieces, board} = this.props.rgu.firstPlayer
    const variables = JSON.stringify({game: {
      gameId, board: JSON.stringify(board)
    , firstPlayerId, firstPlayerName, firstPlayerPieces: JSON.stringify(firstPlayerPieces)
    }})
    const {token} = this.props.user
    const api = new GraphQLApi({token})
    api.runQuery(addQuery, variables).then(res=>{
      console.log('res', res)
    }).catch(err=>{
      console.log('Error', err)
      this.props.mainActions.set({errorText: 'Connection error'})
    })
  }
  _restore(res){
    console.log('restore')
    this.socket = socket(this._game)
    this.gameDetails = {
      ...res
    , board: JSON.parse(res.board)
    , firstPlayerPieces: JSON.parse(res.firstPlayerPieces)
    , secondPlayerPieces: res.secondPlayerId && JSON.parse(res.secondPlayerPieces)
    , playerTurn: parseInt(res.playerTurn, 10)
    }
    this.props.gameActions.set({loading: false})
  }
  _startAsSecondPlayer(){
    const {roomId: gameId} = this.props.match.params
    const {
      id: secondPlayerId, name: secondPlayerName, pieces: secondPlayerPieces
    } = this.props.rgu.secondPlayer
    const variables = JSON.stringify({gameId, game: {
      secondPlayerId, secondPlayerName, secondPlayerPieces: JSON.stringify(secondPlayerPieces)
    }})
    this._updateQuery(variables)
  }
  _updateQuery = variables=>{
    const {token} = this.props.user
    const api = new GraphQLApi({token})
    api.runQuery(updateQuery, variables).then(res=>{
      console.log('update', res)
    }).catch(err=>{
      console.log('Error', err)
      this.props.mainActions.set({errorText: 'Connection error'})
    })
  }
  _onGameEvent = e=>{
    console.log('event', e)
    this.forceUpdate()
    if (!e.type){
      return
    }
    if (e.type === 'switch-turns'){
      const {roomId: gameId} = this.props.match.params
      const variables = JSON.stringify({gameId, game: {
        playerTurn: e.playerTurn
      }})
      this._updateQuery(variables)
    } else if (e.type === 'switch-turn'){
      this.socket.emit('game switch')
    } else if (e.type === 'join-game'){
      this.socket.emit('player join', e.secondPlayer)
    } else if (e.type === 'init-game'){
      this._initialiseGame()
      //this.socket.emit('game init', e.secondPlayer)
      this._startAsSecondPlayer()
    } else if (e.type === 'make-move'){
      this.socket.emit('game move', e.move)
    } else if (e.type === 'die-roll'){
      //this.props.gameActions.set({dieResult: e.dieResult.reduce((a,n)=>a+n,0)})
    }
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
  _next = ()=>{
    // check for correct state. If in correct state, roll dice
  }
  _renderLoading(){
    return (
      <div className='Game'>
        Loading
      </div>
    )
  }
  render() {
    //const {
    //  loading, board, boardDims, containerDim, yourPoints, opponentPoints
    //, yourPlayerId, opponentPlayerId
    //} = this.props.game
    const { loading, text } = this.props.game
    if (loading) return this._renderLoading()
    setTimeout(()=>this._getRenderedBoardPos())
    return (
      <div className='Game'>
        <RoyalGameOfUr
          ref={r=>this._game=r}
          defaultGame={this.gameDetails}
          onEvent={this._onGameEvent}
        />
        <PlayerArea points={this.props.rgu.opponentPoints} isOpponent={true}/>
        <div className='flexGrow'>
          <GameBoard
            {...this.props.game}
            setGameBoard={board=>this.props.gameActions.set({board})}
            game={this.props.rgu}
          />
        </div>
        <PlayerArea points={this.props.rgu.yourPoints}/>
        <FloatingActionButton
          text={text}
          onClick={()=>this._next}
        />
      </div>
    )
  }
}

export default connect(state=>({
  user: state.user
, game: state.game
, rgu: state.rgu
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
, gameActions: bindActionCreators(gameActions, dispatch)
, mainActions: bindActionCreators(mainActions, dispatch)
, rguActions: bindActionCreators(rguActions, dispatch)
}))(Game)
