import React, { PureComponent } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
/*
应用根组件
*/
export default class App extends PureComponent {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' component={Admin} />
        </Switch>
      </BrowserRouter>
    )
  }
}