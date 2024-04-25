import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import HomePage from './components/HomePage.jsx';
import Profile from './components/Profile.jsx';
import Recommendations from './components/Recommendations.jsx';
import ChatInterface from './components/ChatInterface.jsx';
import Navbar from './components/NavBar.jsx';
import ChatList from './components/ChatList.jsx';
import LandingPage from './components/Landing.jsx';
import Posts from './components/Posts.jsx';
import AuthDebugger from './components/AuthDebugger.jsx';
import Verify from './components/Verify.jsx';
import { AuthTokenProvider } from './AuthTokenContext.js';
import { RecommendationsProvider } from './context/RecommendationsContext.js';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
const requestedScopes = ["profile", "email"];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth0();

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <RecommendationsProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<Verify />} />
        {isAuthenticated ? (
        <Route>  
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/chat/:profileId" element={<ChatInterface />} />
          <Route path="/chatlist" element={<ChatList />} />
          <Route path="/posts" element={<Posts />} />
        </Route>) : (
          <Route path="/*" element={<Navigate to="/" replace />} />
       )}
        <Route path="/auth-debugger" element={<AuthDebugger />} />
      </Routes>
      </RecommendationsProvider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify`,
        audience: audience,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>

);

