import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const OAuthCallback = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('oauth_state');

      // Verify state to prevent CSRF
      if (state !== storedState) {
        setError('Invalid state parameter. Please try again.');
        return;
      }

      if (!code) {
        setError('No authorization code received.');
        return;
      }

      // In a real implementation, you would exchange the code for an access token
      // This requires a backend server to keep the client secret secure
      // For demo purposes, we'll show a message
      
      // The actual flow would be:
      // 1. Send code to your backend
      // 2. Backend exchanges code for access token with GitHub
      // 3. Backend returns access token to frontend
      // 4. Frontend stores token and fetches user info

      setError(
        'GitHub OAuth requires a backend server to exchange the authorization code for an access token securely. ' +
        'For this demo, please use the password login with "admin123".'
      );
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-coral text-2xl">!</span>
          </div>
          <h1 className="font-display font-bold text-xl text-white mb-2">
            Authentication Error
          </h1>
          <p className="text-white/60 mb-6">{error}</p>
          <a href="/admin/login" className="btn-primary">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-coral animate-spin mx-auto mb-4" />
        <p className="text-white/60">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
