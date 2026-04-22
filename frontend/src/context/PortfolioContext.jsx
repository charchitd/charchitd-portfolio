import React, { createContext, useState, useEffect, useCallback } from 'react';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('admin_token') || null);

  // In Vercel, requests to /api are automatically routed to the backend serverless functions.
  // In local development, we need to point to localhost:5000 if not running through a proxy.
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Helper: check if a JWT token is expired by decoding its payload
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }, []);

  // Logout helper
  const logout = useCallback(() => {
    setAuthToken(null);
    setIsAdmin(false);
    localStorage.removeItem('admin_token');
  }, []);

  // Validate stored token on mount
  useEffect(() => {
    if (authToken) {
      if (isTokenExpired(authToken)) {
        // Token is expired — clear it immediately
        logout();
      } else {
        setIsAdmin(true);
        // Set a timer to auto-logout when the token expires
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const msUntilExpiry = payload.exp * 1000 - Date.now();
        const timer = setTimeout(() => {
          logout();
          alert('Your session has expired. Please log in again.');
        }, msUntilExpiry);
        return () => clearTimeout(timer);
      }
    }
  }, [authToken, isTokenExpired, logout]);

  // Fetch initial data from backend
  useEffect(() => {
    fetch(`${API_URL}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data || {}))
      .catch(err => console.error("Error fetching profile", err));

    fetch(`${API_URL}/experience`)
      .then(res => res.json())
      .then(data => setExperience(data || []))
      .catch(err => console.error("Error fetching experience", err));

    fetch(`${API_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data || []))
      .catch(err => console.error("Error fetching projects", err));

    fetch(`${API_URL}/thoughts`)
      .then(res => res.json())
      .then(data => setThoughts(data || []))
      .catch(err => console.error("Error fetching thoughts", err));
  }, []);

  // Save token when state changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('admin_token', authToken);
    } else {
      localStorage.removeItem('admin_token');
    }
  }, [authToken]);

  return (
    <PortfolioContext.Provider value={{
      profile, setProfile,
      experience, setExperience,
      projects, setProjects,
      thoughts, setThoughts,
      isAdmin, setIsAdmin,
      authToken, setAuthToken,
      logout,
      API_URL
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
