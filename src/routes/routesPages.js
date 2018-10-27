import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import pageConfig from '../entry/pageConfig';
import { viewsConfig } from '../utils/viewTools';

export default class RouterPages extends React.Component {
  render () {
    return (
      <Switch>
        <Route exact path='/' component={viewsConfig(pageConfig['/index'])}/>;
        {Object.keys(pageConfig).map((pageKey, index) => {
          const Page = viewsConfig(pageConfig[pageKey]);
          return <Route key={index} exact path={pageKey} component={Page}/>;
        })}
        <Route render={() => <Redirect to="/404"/>}/>
      </Switch>
    );
  }
}
