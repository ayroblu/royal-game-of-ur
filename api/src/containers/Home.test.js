import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';

//it('renders without crashing', () => {
//  const div = document.createElement('div');
//  ReactDOM.render(<Home store={{}} />, div);
//});

describe('auth', ()=>{
  it('has login', ()=>{ expect(false).toBeTruthy() })
  it('has logout', ()=>{ expect(false).toBeTruthy() })
  it('has roles', ()=>{ expect(false).toBeTruthy() })
  it('has register', ()=>{ expect(false).toBeTruthy() })
  it('has forgotpassword', ()=>{ expect(false).toBeTruthy() })
})
describe('subscriptions', () => {
  it('has free state', ()=>{ expect(false).toBeTruthy() })
  it('has paid tier', ()=>{ expect(false).toBeTruthy() })
  it('can take real credit cards', ()=>{ expect(false).toBeTruthy() })
  it('has user logins', ()=>{ expect(false).toBeTruthy() })
})
describe('layout', () => {
  it('has setup snapshot testing', ()=>{ expect(true).toBeTruthy() })
  it('has a frontpage', ()=>{ expect(false).toBeTruthy() })
  it('has a login', ()=>{ expect(false).toBeTruthy() })
  it('has a registration', ()=>{ expect(false).toBeTruthy() })
  it('has an event page', ()=>{ expect(false).toBeTruthy() })
})
describe('backend', () => {
  it('setup CI', ()=>{ expect(false).toBeTruthy() })
})
describe('events', ()=>{
  it('can add people to events', ()=>{ expect(false).toBeTruthy() })
  it('comments', ()=>{ expect(false).toBeTruthy() })
  it('description', ()=>{ expect(false).toBeTruthy() })
  it('schedule', ()=>{ expect(false).toBeTruthy() })
})
