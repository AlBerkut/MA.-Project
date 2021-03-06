import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { RootStore } from '../../../reducers';
import { AuthProvider } from '../../../context/authContext';
import { State, StateStatuses } from '../../../utils/State';
import { tokensProvider } from '../../../services/api';
import { ROUTES } from '../../../routes';

type Props = {};

const initAuthState = {
  authenticated: false,
  isAdmin: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toLoginRedirect: () => {
    return null;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toLogoutRedirect: () => {
    return null;
  }
};

const Auth: FC<Props> = ({ children }) => {
  const [authState, setAuthState] = useState(initAuthState);
  const dispatch = useDispatch();
  const history = useHistory();

  const loginState = useSelector<RootStore, State<any>>(
    (state) => state.tokensState
  );

  const checkVerification = useSelector<RootStore, State<any>>(
    (state) => state.checkEmailVerification
  );

  const googleAuth = useSelector<RootStore, State<any>>(
    (state) => state.googleAuth
  );

  useEffect(() => {
    if (loginState.status === StateStatuses.LOADED) {
      const tokens = loginState.payload.tokenData;

      tokensProvider.saveTokens(tokens);
      setAuthState((prevState) => {
        return {
          ...prevState,
          authenticated: true,
          token: loginState.payload.tokenData,
          isAdmin: false
        };
      });
    }

    if (checkVerification.status === StateStatuses.LOADED) {
      const tokens = checkVerification.payload.tokenData;

      tokensProvider.saveTokens(tokens);
      setAuthState((prevState) => {
        return {
          ...prevState,
          authenticated: true,
          token: checkVerification.payload.tokenData,
          isAdmin: false
        };
      });
      history.push('/');
    }

    if (googleAuth.status === StateStatuses.LOADED) {
      const token = { token: googleAuth.payload.token };
      tokensProvider.saveTokens(token);
      setAuthState((prevState) => {
        return {
          ...prevState,
          authenticated: true,
          token: googleAuth.payload.token,
          isAdmin: false
        };
      });
      history.push('/');
    }
  }, [loginState, checkVerification, googleAuth]);

  const toLoginRedirect = () => {
    return <Redirect to={`${ROUTES.LOGIN}`} />;
  };

  const toLogoutRedirect = () => {
    tokensProvider.removeTokens();
  };

  const authValues = {
    ...authState,
    toLoginRedirect,
    toLogoutRedirect
  };

  return <AuthProvider value={authValues}>{children}</AuthProvider>;
};

export default Auth;
