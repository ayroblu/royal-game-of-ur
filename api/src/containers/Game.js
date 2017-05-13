import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import io from 'socket.io-client'

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
      this.initSocket()
      if (res.errors){
        console.log('Invalid query')
        this.props.mainActions.set({errorText: 'Invalid query'})
      } else if (!res.data.game){
        //this._initialiseGame()
        this.props.gameActions.set({loading: false})
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

    const {roomId: gameId} = this.props.match.params
    const {id: firstPlayerId, name: firstPlayerName, pieces: firstPlayerPieces} = this.props.rgu.firstPlayer
    const variables = JSON.stringify({game: {
      gameId, firstPlayerId, firstPlayerName, firstPlayerPieces: JSON.stringify(firstPlayerPieces)
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
    this.gameDetails = {
      ...res
    , firstPlayerPieces: JSON.parse(res.firstPlayerPieces)
    , secondPlayerPieces: res.secondPlayerId && JSON.parse(res.secondPlayerPieces)
    , playerTurn: parseInt(res.playerTurn, 10)
    }
    //this.props.rguActions.set(gameDetails)
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
  initSocket(){
    const socket = io()
    this.socket = socket
    socket.on('connect', ()=>{
      console.log('Socket connection made')
    })
    socket.on('game start', playerTurn=>{
      console.log('game start')
      this.props.rguActions.set({playerTurn})
    })
    socket.on('game move', data=>{
      console.log('game move', data)
      this._game.opponentsMove(data)
    })
    socket.on('game switch', ({playerTurn})=>{
      console.log('game switch', playerTurn)
      this.props.rguActions.set({playerTurn})
    })
    socket.on('player join', data=>{
      console.log('player join', data)
      this._game.addSecondPlayer(data)
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
      this.socket.emit('game switch', {playerTurn: e.playerTurn})
    } else if (e.type === 'start-game'){
      //update
      const {roomId: gameId} = this.props.match.params
      const variables = JSON.stringify({gameId, game: {
        playerTurn: e.playerTurn
      }})
      this._updateQuery(variables)
      this.socket.emit('game start', e.playerTurn)
    } else if (e.type === 'join-game'){
      this._startAsSecondPlayer()
      this.socket.emit('player join', e.secondPlayer)
    } else if (e.type === 'init-game'){
      this._initialiseGame()
      //this.socket.emit('game init', e.secondPlayer)
      //this._startAsSecondPlayer()
    } else if (e.type === 'make-move'){
      const {roomId: gameId} = this.props.match.params
      const variables = JSON.stringify({gameId, game: {
        firstPlayerPieces: JSON.stringify(this.props.rgu.firstPlayer.pieces)
      , secondPlayerPieces: JSON.stringify(this.props.rgu.secondPlayer.pieces)
      }})
      this._updateQuery(variables)
      this.socket.emit('game move', e.move)
    } else if (e.type === 'die-roll'){
      //this.props.gameActions.set({dieResult: e.dieResult.reduce((a,n)=>a+n,0)})
    }
  }
  _getRenderedBoardPos(){
    if (this.props.game.boardDims || !document.querySelector('.GameBoard')){
      return
    }
    const cDim = document.querySelector('.GameBoard').getBoundingClientRect()
    const gBlocks = Array.from(document.querySelectorAll('.GameBlock')).map(g=>g.getBoundingClientRect())
    const gDim = _.chunk(gBlocks, 8)
    this.props.gameActions.set({boardDims: gDim, containerDim: cDim})
  }
  _next = ()=>{
    // check for correct state. If in correct state, roll dice
    console.log('Next pressed');
    const {isFirstPlayer, playerTurn, victor, availableMoves} = this.props.rgu
    if (victor || availableMoves) return
    const playerNumber = isFirstPlayer ? 1 : 2
    if (playerTurn === playerNumber){
      console.log('game', this._game)
      this._game.rollDie()
    }
  }
  _renderLoading(){
    return (
      <div className='Game'>
        Loading
      </div>
    )
  }
  render() {
    const { loading } = this.props.game
    const {rgu} = this.props
    if (loading) return this._renderLoading()
    setTimeout(()=>this._getRenderedBoardPos())
    return (
      <div className='Game'>
        <RoyalGameOfUr
          setRef={r=>this._game=r}
          defaultGame={this.gameDetails}
          onEvent={this._onGameEvent}
        />
        <PlayerArea player={rgu.isFirstPlayer ? rgu.secondPlayer : rgu.firstPlayer} points={this.props.rgu.opponentPoints} isOpponent={true} waiting={!rgu.secondPlayer}/>
        <div className='flexGrow'>
          <GameBoard
            {...this.props.game}
            game={this.props.rgu}
          />
        </div>
        <PlayerArea player={rgu.isFirstPlayer ? rgu.firstPlayer : rgu.secondPlayer} points={this.props.rgu.yourPoints}/>
        <FloatingActionButton
          text={rgu.text}
          onClick={this._next}
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
