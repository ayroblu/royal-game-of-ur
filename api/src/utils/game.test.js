import {
  createBoard
, createPlayerPieces
, posToCoords
, decideStart
, rollDie
, availableMoves
, checkPoints
, checkVictory
, checkReroll
, numPieces
} from './game'

describe('Positions to coordinates', ()=>{
  it('knows position 0', ()=>{
    expect(posToCoords(0)).toEqual([-1,-1])
  })
  it('knows position 2', ()=>{
    expect(posToCoords(2)).toEqual([2,2])
  })
  it('knows position 5', ()=>{
    expect(posToCoords(5)).toEqual([1,0])
  })
  it('knows position 11', ()=>{
    expect(posToCoords(11)).toEqual([1,6])
  })
  it('knows position 13', ()=>{
    expect(posToCoords(13)).toEqual([2,7])
  })
  it('knows position 15', ()=>{
    expect(posToCoords(15)).toEqual([2,5])
  })
})
describe('Game play', ()=>{
  it('can decide start', ()=>{
    expect(typeof decideStart()).toEqual('boolean')
  })
  it('can roll dice', ()=>{
    const diceResult = rollDie().reduce((a,n)=>a+(n?1:0),0)
    expect(diceResult >= 0 && diceResult <= 4).toEqual(true)
  })
  it('has initial move', ()=>{
    const board = createBoard()
    const pieces = createPlayerPieces()
    const move = availableMoves(board, pieces, 2)
    expect(move).toEqual([{coord: [2,2], pos: 2, id: 0}])
  })
  it('has initial points check', ()=>{
    const pieces = createPlayerPieces()
    expect(checkPoints(pieces)).toEqual(0)
  })
  it('has middle points check', ()=>{
    const pieces = createPlayerPieces()
    pieces[0].pos = pieces[3].pos = pieces[5].pos = 15
    expect(checkPoints(pieces)).toEqual(3)
  })
  it('has end points check', ()=>{
    const pieces = createPlayerPieces()
    pieces.forEach(p=>p.pos = 15)
    expect(checkPoints(pieces)).toEqual(7)
  })
  it('victory check', ()=>{
    expect(checkVictory(6)).toEqual(false)
    expect(checkVictory(7)).toEqual(true)
  })
  it('reroll check', ()=>{
    const board = createBoard()
    expect(checkReroll(board, [2,0])).toEqual(true)
    expect(checkReroll(board, [2,1])).toEqual(false)
  })
})
function* thing(){
  yield 'hi'
  yield 'cute'
}
it('can run test', ()=>{
  const a = thing()
  console.log(a.next())
  console.log(a.next())
  console.log(a.next())
})
