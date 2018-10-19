import React from 'react';
import {
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import {getToken,removeToken} from 'utils/auth';

import  Login from  'views/login';
import  Layout from   'views/layout';

/* 进入路由的判断 */


const Routes =()=> (
    <Switch>
      <Route exec path="/login" component={Login}/>
      <PrivateRoute exec path="" component={Layout}/>
    </Switch>
);
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);
export default Routes;
