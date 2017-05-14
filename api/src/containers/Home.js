import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

import * as homeActions from '../actions/home'
import * as mainActions from '../actions/main'
import './Home.css'
import {GraphQLApi} from '../api'

const query = `
query{
  games{
    gameId
    whenAdded
  }
}
`
class Home extends Component {
  componentWillMount(){
    const api = new GraphQLApi()
    const nextGame = Math.random().toString(36).substring(2)
    api.runQuery(query).then(res=>{
      console.log('list of games', res)
      if (!res || res.errors){
        this.props.mainActions.set({errorText: 'Failed to get data'})
        return
      }
      this.props.homeActions.set({loading: false, games: res.data.games, nextGame})
    }).catch(err=>{
      console.error('Connection error', err)
      this.props.mainActions.set({errorText: 'Connection error'})
    })
  }
  _renderExistingGames(games){
    return (
      <table>
        <thead>
          <tr>
            <th>Game Id</th>
            <th>When Created</th>
          </tr>
        </thead>
        <tbody>
          {games.map(game=>(
            <tr key={game.gameId} onClick={()=>this.props.history.push(`/game/${game.gameId}`)}>
              <td>
                {game.gameId}
              </td>
              <td>
                {moment(game.whenAdded).format()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  render() {
    let existingGames = <div className='block'>Loading...</div>
    const {loading, games, nextGame} = this.props.home
    if (!loading){
      if (games.length){
        existingGames = this._renderExistingGames(games)
      } else {
        existingGames = <div className='block'>No games found</div>
      }
    }
    return (
      <div className='Home'>
        <h1>The Royal Game of Ur</h1>
        <p>This is a 4,500 year old game, one of the oldest, if not the oldest board game in history</p>
        <div>
          <h2>Here's the youtube video that inspired me to make this, as well as where I get the basic rules from</h2>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/WZskjLq040I" frameBorder="0" allowFullScreen></iframe>
        </div>
        <div className='start'>
          <Link to={`/game/${nextGame}`}>Start a game!</Link>
        </div>
        <section className='existingGames'>
          <h2>Existing Games</h2>
          <div className='games'>
            {existingGames}
          </div>
        </section>
      </div>
    )
  }
}

export default connect(state=>({
  home: state.home
}), dispatch=>({
  homeActions: bindActionCreators(homeActions, dispatch)
, mainActions: bindActionCreators(mainActions, dispatch)
}))(Home)
