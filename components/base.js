import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';
import moment from 'moment';
import PropTypes from 'prop-types';

import Sidebar from '../components/sidebar';
import dataFetch from '../utils/dataFetch';
import Header from './header';
import LoadingScreen from './loadingScreen';
import AuthRequired from './authRequired';

const cookies = new Cookies();

const Base = ({
  children,
  title,
  adminRequired = false,
  verificationRequired = true,
}) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [data, setData] = useState({});

  const refreshTokenQuery = `
  mutation refresh($refresh: String!) {
  refreshToken(refreshToken: $refresh) {
    token
    refreshToken
    payload
    refreshExpiresIn
  }
}
  `;
  const refreshTokens = async (refreshTokenVariables) =>
    dataFetch({ query: refreshTokenQuery, variables: refreshTokenVariables });
  const fetchData = async () =>
    await dataFetch({ query: `{ isAdmin isClubMember }` });

  useEffect(() => {
    const token = cookies.get('token');
    const refreshToken = cookies.get('refreshToken');
    const expiry = cookies.get('expiry');
    const fetchStatus = () => {
      if (!userLoaded) {
        fetchData().then((r) => {
          setData(r.data);
        }).finally(() => setUserLoaded(true));
      }
    };
    if (!loaded) {
      if (token !== undefined || refreshToken !== undefined) {
        fetchStatus();
        if (moment().unix() + 50 > expiry) {
          const refreshTokenVariables = { refresh: refreshToken };
          refreshTokens(refreshTokenVariables).then((response) => {
            if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
              const tokenMaxAge =
                response.data.refreshToken.payload.exp -
                response.data.refreshToken.payload.origIat;
              cookies.set('token', response.data.refreshToken.token, {
                path: '/',
                maxAge: tokenMaxAge,
              });
              cookies.set('refreshToken', response.data.refreshToken.refreshToken, {
                path: '/',
                maxAge: response.data.refreshToken.refreshExpiresIn,
              });
              cookies.set('username', response.data.refreshToken.payload.username, {
                path: '/',
                maxAge: response.data.refreshToken.refreshExpiresIn,
              });
              cookies.set('expiry', response.data.refreshToken.payload.exp, {
                path: '/',
                maxAge: response.data.refreshToken.refreshExpiresIn,
              });
            } else {
              router.push('/logout');
            }
          });
        }
      } else {
        router.push('/login');
      }
      setLoaded(true);
    }
  }, []);

  return loaded ? (
    adminRequired || verificationRequired ? (
      <AuthRequired
        loaded={userLoaded}
        isAdmin={data?.isAdmin}
        isClubMember={data?.isClubMember}
        verificationRequired={verificationRequired}
        adminRequired={adminRequired}
      >
        <Header title={title} />
        <Sidebar isAdmin={data?.isAdmin} selected={router.pathname}>
          <div style={{ minHeight: '100vh' }}>{children}</div>
        </Sidebar>
      </AuthRequired>
    ) : (
      <React.Fragment>
        <Header title={title} />
        <Sidebar isAdmin={data?.isAdmin} selected={router.pathname}>
          <div style={{ minHeight: '100vh' }}>{children}</div>
        </Sidebar>
      </React.Fragment>
    )
  ) : (
    <LoadingScreen text="Loading..." />
  );
};

Base.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  adminRequired: PropTypes.bool,
  verificationRequired: PropTypes.bool,
};

export default Base;
