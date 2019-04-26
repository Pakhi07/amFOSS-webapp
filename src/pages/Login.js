import React from 'react';
import { Helmet } from 'react-helmet';
import 'babel-polyfill';
import { Tooltip, Button, Card, FormGroup, InputGroup } from '@blueprintjs/core';
import Topbar from '../components/topbar';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router';

import dataFetch from '../utils/dataFetch';

const cookies = new Cookies();

const query = `
mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
        token
        refreshToken
    }
}`;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: null,
      refreshToken: null,
      showPassword: false,
      cookieSet: false
    };
    this.passwordEntry = this.passwordEntry.bind(this);
    this.usernameEntry = this.usernameEntry.bind(this);
    this.handleLockClick = this.handleLockClick.bind(this);
  }

  componentDidMount() {
    let token = cookies.get('token');
    if(token != null) {
      this.setState({
        cookieSet: true,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.token !== null && !this.state.cookieSet) {
      cookies.set('token', this.state.token, { path: '/' });
      cookies.set('refreshToken',this.state.refreshToken, { path: '/' });
      this.setState({ cookieSet: true });
    }
  }

  passwordEntry(event) {
    this.setState({ password: event.target.value });
  }

  usernameEntry(event) {
    this.setState({ username: event.target.value });
  }

  handleLockClick() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  login = async () => {
    const variables = { username: this.state.username, password: this.state.password };
    const response = await dataFetch({ query, variables });
    this.setState({
      token: response.data.tokenAuth.token,
      refreshToken: response.data.tokenAuth.refreshToken,
    });
  };

  render() {
    if (this.state.cookieSet) return <Redirect to="/" />;
    const lockButton = (
      <Tooltip content={`${this.state.showPassword ? 'Hide' : 'Show'} Password`}>
        <Button
          icon={this.state.showPassword ? 'unlock' : 'lock'}
          intent="warning"
          minimal
          onClick={this.handleLockClick}
        />
      </Tooltip>
    );
    return (
      <React.Fragment>
        <Helmet>
          <title>Login Page</title>
        </Helmet>
        <Topbar />
        <Card elevation="2">
          <h1>Login</h1>
          <FormGroup label="Username" labelFor="text-input" labelInfo="(required)">
            <InputGroup onChange={this.usernameEntry} placeholder="Enter your username" />
          </FormGroup>
          <FormGroup label="Password" labelFor="text-input" labelInfo="(required)">
            <InputGroup
              placeholder="Enter your password..."
              onChange={this.passwordEntry}
              rightElement={lockButton}
              type={this.state.showPassword ? 'text' : 'password'}
            />
          </FormGroup>
          <Button type="submit" intent="primary" text="Login" onClick={this.login} />
          {this.state.response}
        </Card>
      </React.Fragment>
    );
  }
}

export default Login;