import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import socket from '../utils/socket'
import GameBoard from '../components/GameBoard'
import PlayerArea from '../components/PlayerArea'
import FloatingActionButton from '../components/FloatingActionButton'
import * as userActions from '../actions/user'
import * as gameActions from '../actions/game'
import * as mainActions from '../actions/main'
import './Game.css'
import {GameEngine} from '../utils/game'
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
    console.log('init')
    api.runQuery(query, variables).then(res=>{
      console.log('first res', res)
      if (!res){
        console.log('Invalid query')
        this.props.mainActions.set({errorText: 'Invalid query'})
      } else if (!res.data.game){
        console.log('initialise')
        this._initialiseGame()
      } else {
        console.log('restore')
        this._restore(res.data.game)
      }
    }).catch(err=>{
      console.log('Error', err)
      this.props.mainActions.set({errorText: 'Connection error'})
    })
  }
  _initialiseGame(){
    const yourPlayerId = GameEngine.generateId()
    window.localStorage.setItem('playerId', yourPlayerId)
    const game = new GameEngine(yourPlayerId)
    game.onEvent = this._onGameEvent
    window.game = game
    this.socket = socket(game)
    this.props.gameActions.set({game, loading: false, board: game.board, yourPlayerId})

    const {roomId: gameId} = this.props.match.params
    const {id: firstPlayerId, name: firstPlayerName, pieces: firstPlayerPieces} = game.firstPlayer
    const variables = JSON.stringify({game: {
      gameId, board: JSON.stringify(game.board)
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
    const yourPlayerId = window.localStorage.getItem('playerId') || GameEngine.generateId()
    const game = new GameEngine(yourPlayerId, {
      ...res
    , board: JSON.parse(res.board)
    , firstPlayerPieces: JSON.parse(res.firstPlayerPieces)
    , secondPlayerPieces: res.secondPlayerId && JSON.parse(res.secondPlayerPieces)
    , playerTurn: parseInt(res.playerTurn, 10)
    })
    game.onEvent = this._onGameEvent
    window.game = game
    this.socket = socket(game)
    this.props.gameActions.set({game, loading: false, board: game.board, yourPlayerId})

    if (game._isFirstPlayer || game._hasStarted || !game.secondPlayer){
      return
    }
    const {roomId: gameId} = this.props.match.params
    const {
      id: secondPlayerId, name: secondPlayerName, pieces: secondPlayerPieces
    } = game.secondPlayer
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
    } else if (e.type === 'make-move'){
      this.socket.emit('game move', e.move)
    } else if (e.type === 'die-roll'){
      this.props.gameActions.set({dieResult: e.dieResult.reduce((a,n)=>a+n,0)})
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
    const {game} = this.props.game
    if (game._hasStarted){
      const yourPieces = game.getYourPieces()
      const opponentPieces = game.getOpponentPieces()
      this.props.gameActions.set({text: game.next().value, yourPieces, opponentPieces})
    } else {
      this.props.gameActions.set({text: game.next().value})
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
    //const {
    //  loading, board, boardDims, containerDim, yourPoints, opponentPoints
    //, yourPlayerId, opponentPlayerId
    //} = this.props.game
    const { game, loading, text } = this.props.game
    if (loading) return this._renderLoading()
    setTimeout(()=>this._getRenderedBoardPos())
    return (
      <div className='Game'>
        <PlayerArea points={game.getOpponentPoints()} isOpponent={true}/>
        <div className='flexGrow'>
          <GameBoard
            {...this.props.game}
            setGameBoard={board=>this.props.gameActions.set({board})}
          />
        </div>
        <PlayerArea points={game.getYourPoints()}/>
        <FloatingActionButton
          text={text}
          onClick={this._next}
        />
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
