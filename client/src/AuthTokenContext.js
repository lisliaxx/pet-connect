import React, { useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthTokenContext = React.createContext();

const requestScopes = ["profile", "email"];

function AuthTokenProvider({ children }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: requestScopes.join(' ')
        });
        setToken(accessToken);
      } catch (e) {
        console.error(e);
      }
    };

    if (isAuthenticated) {
      getToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <AuthTokenContext.Provider value={token}>
      {children}
    </AuthTokenContext.Provider>
  );
}

const useAuthToken = () => useContext(AuthTokenContext);

export { AuthTokenProvider, useAuthToken };