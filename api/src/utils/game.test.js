import {posToCoords} from './game'

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
