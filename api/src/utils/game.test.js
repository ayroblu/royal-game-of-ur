import {positionToCoords} from './game'

describe('Positions to coordinates', ()=>{
  it('knows position 0', ()=>{
    expect(positionToCoords(0)).toEqual([-1,-1])
  })
  it('knows position 2', ()=>{
    expect(positionToCoords(2)).toEqual([2,2])
  })
  it('knows position 5', ()=>{
    expect(positionToCoords(5)).toEqual([1,0])
  })
  it('knows position 11', ()=>{
    expect(positionToCoords(11)).toEqual([1,6])
  })
  it('knows position 13', ()=>{
    expect(positionToCoords(13)).toEqual([2,7])
  })
  it('knows position 15', ()=>{
    expect(positionToCoords(15)).toEqual([-2,-2])
  })
})
