import React, { createContext, useState, useEffect } from 'react';

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
      API_URL
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
