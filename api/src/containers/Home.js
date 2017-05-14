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
          <p>I highly recommend watching this video, its very entertaining and very interesting</p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/WZskjLq040I" frameBorder="0" allowFullScreen></iframe>
        </div>
        <div className='Left'>
          <h2>Basic rules</h2>
          <p>The game is similar to a smaller version of ludo.</p>
          <p>You have seven pieces, you want to get your pieces on and around the track to the finish.</p>
          <p>The middle section is common ground meaning you can remove opponent pieces, or they can remove your pieces when you land on opposing pieces.</p>
          <p>There are two types of special squares, one is for a reroll and the other is where your piece cannot be removed, and an opposing piece simply moves to the next square.</p>
          <p>The dice roll is a set of 4 D4's, tetrahedrons, where each has 2 out of 4 white points, where if a white point is sitting up, it counts as a move. For the purposes of this version, the math is the same under the hood, but I just output the move counter and available moves.</p>
          <p>First to 7 points wins!</p>
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
        <div className='Left'>
          <h2>Wishlist</h2>
          <p>This was a nice side project, but I'd really like to add the following</p>
          <ul>
            <li>Better graphics and images which more accurate reflect the game board</li>
            <li>Better animations, 3D, dice rolls</li>
            <li>Game chat</li>
            <li>Game names</li>
            <li>Mobile support</li>
            <li>So much more!</li>
          </ul>
        </div>
        <footer>
          Built by Ben, view the code at the github link <a href='https://github.com/ayroblu/royal-game-of-ur'>here</a>
        </footer>
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
