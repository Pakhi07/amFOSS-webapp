import React, { Component } from 'react';
import HttpsRedirect from 'react-https-redirect';

import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import '@blueprintjs/core/lib/css/blueprint';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import 'react-quill/dist/quill.snow.css';
import 'react-dropzone-component/styles/filepicker.css';
import './styles/styles.sass';

import Cookies from 'universal-cookie';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Task from './pages/Task';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import CheckIn from './pages/Check-in';

import NotFound from './pages/404';

import PrivateRoute from './components/PrivateRoute';

import DailyReport from './pages/attendance/DailyReport';
import LiveReport from './pages/attendance/LiveReport';
import AttendanceDashboard from './pages/attendance/Dashboard';

const cookies = new Cookies();

const LogoutPage = () => {
  cookies.remove('token');
  cookies.remove('refreshToken');
  cookies.remove('username');
  localStorage.clear();
  return <Redirect to="/login" />;
};

const redirectToAttendanceDashboard = () => {
  return <Redirect to="/attendance/dashboard" />;
};

export default class App extends Component {
  render() {
    return (
      <HttpsRedirect>
        <Helmet>
          <title>amFOSS App</title>
        </Helmet>
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/logout" component={LogoutPage} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/tasks" component={Tasks} />
            <PrivateRoute exact path="/tasks/:id" component={Task} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/update-profile" component={Edit} />
            <PrivateRoute exact path="/events/check-in" component={CheckIn} />

            <PrivateRoute
              exact
              path="/attendance"
              component={redirectToAttendanceDashboard}
            />
            <PrivateRoute
              exact
              path="/attendance/dashboard"
              component={AttendanceDashboard}
            />
            <PrivateRoute
              exact
              path="/attendance/daily-report"
              component={DailyReport}
            />
            <PrivateRoute
              exact
              path="/attendance/live-report"
              component={LiveReport}
            />
            <PrivateRoute component={NotFound} />
          </Switch>
        </BrowserRouter>
      </HttpsRedirect>
    );
  }
}
