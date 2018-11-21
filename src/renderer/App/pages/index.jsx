import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Notifications from './Notifications';
import Users from './Users';
import Inventory from './Inventory';
import Files from './Files';
import File from './File';
import Login from './Login';
import Fallback from './Fallback';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/profile" exact render={Profile} />
    <Route path="/users" exact render={Users} />
    <Route path="/notifications" exact render={Notifications} />
    <Route path="/inventory" exact render={Inventory} />
    <Route path="/login" exact render={Login} />
    <Route path="/files" exact render={Files} />
    <Route path="/file/:name" component={File} />
    <Route render={Fallback} />
  </Switch>
);

export default Routes;
