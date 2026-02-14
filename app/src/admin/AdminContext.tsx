import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
}

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'; // Replace with your GitHub OAuth App ID
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/admin/callback` : '';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('github_token');
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Only allow specific GitHub user (you) to access admin
        if (userData.login === 'charchitd') { // Replace with your GitHub username
          setUser({
            id: userData.id,
            login: userData.login,
            name: userData.name || userData.login,
            avatar_url: userData.avatar_url,
            email: userData.email
          });
          setIsLoading(false);
          return true;
        } else {
          // Not authorized - wrong user
          localStorage.removeItem('github_token');
          setIsLoading(false);
          return false;
        }
      } else {
        localStorage.removeItem('github_token');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('github_token');
      setIsLoading(false);
      return false;
    }
  };

  const login = () => {
    // For demo/development: Use a simple password-based auth
    // In production, use GitHub OAuth
    const useGitHubOAuth = false; // Set to true when you have a GitHub OAuth App
    
    if (useGitHubOAuth) {
      const scope = 'read:user';
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}`;
      window.location.href = authUrl;
    } else {
      // Simple password auth for demo
      const password = prompt('Enter admin password:');
      if (password === 'admin123') { // Change this to a secure password
        const mockUser: AdminUser = {
          id: '1',
          login: 'charchitd',
          name: 'Charchit Dhawan',
          avatar_url: '/images/hero_portrait.jpg'
        };
        setUser(mockUser);
        localStorage.setItem('admin_session', JSON.stringify(mockUser));
      } else {
        alert('Invalid password');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('admin_session');
    setUser(null);
  };

  return (
    <AdminContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
