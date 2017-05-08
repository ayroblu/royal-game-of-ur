import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';

//it('renders without crashing', () => {
//  const div = document.createElement('div');
//  ReactDOM.render(<Home store={{}} />, div);
//});

describe('layout', ()=>{
  it('has gameboard', ()=>{ expect(false).toBeTruthy() })
  it('has players sections', ()=>{ expect(false).toBeTruthy() })
  it('has rooms', ()=>{ expect(false).toBeTruthy() })
  it('has socket.io', ()=>{ expect(false).toBeTruthy() })
  it('has player naming', ()=>{ expect(false).toBeTruthy() })
  it('has player finding', ()=>{ expect(false).toBeTruthy() })
  it('has players page', ()=>{ expect(false).toBeTruthy() })
  it('has game page', ()=>{ expect(false).toBeTruthy() })
  it('has victory page/overlay', ()=>{ expect(false).toBeTruthy() })
  it('has loser page/overlay', ()=>{ expect(false).toBeTruthy() })
})
describe('keyboard shortcuts', ()=>{
  it('cursor movement', ()=>{ expect(false).toBeTruthy() })
  it('dice roll', ()=>{ expect(false).toBeTruthy() })
  it('piece movement', ()=>{ expect(false).toBeTruthy() })
})
describe('backend', ()=>{
  it('saves game state - every move', ()=>{ expect(false).toBeTruthy() })
  it('restore game state when opening a room', ()=>{ expect(false).toBeTruthy() })
  it('validate via move count - should always be sequential', ()=>{ expect(false).toBeTruthy() })
  it('in a room, live updates with socket io', ()=>{ expect(false).toBeTruthy() })
})
describe('gameplay', ()=>{
  it('pieces and their movement', ()=>{ expect(false).toBeTruthy() })
  it('dice roll - 4 tetrahedral with 2 white points each', ()=>{ expect(false).toBeTruthy() })
  it('has squares for re rolls', ()=>{ expect(false).toBeTruthy() })
  it('has invulnerable square with reroll', ()=>{ expect(false).toBeTruthy() })
  it('has a show valid moves', ()=>{ expect(false).toBeTruthy() })
  it('removes enemy piece', ()=>{ expect(false).toBeTruthy() })
})
