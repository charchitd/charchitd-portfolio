import { useState } from 'react';
import { Lock, Github, ArrowLeft, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  const isAuthenticated = localStorage.getItem('admin_session') !== null;

  // Simple password-based login for demo
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check password (in production, this would be server-side)
    if (password === 'admin123') {
      localStorage.setItem('admin_session', JSON.stringify({
        id: '1',
        login: 'charchitd',
        name: 'Charchit Dhawan',
        avatar_url: '/images/hero_portrait.jpg'
      }));
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid password');
      setIsLoading(false);
    }
  };

  // GitHub OAuth login
  const handleGitHubLogin = () => {
    const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
    const REDIRECT_URI = `${window.location.origin}/admin/callback`;
    const scope = 'read:user';
    
    // Store state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
  };

  if (isAuthenticated) {
    window.location.href = '/admin/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to site link */}
        <a 
          href="/" 
          className="absolute -top-16 left-0 flex items-center gap-2 text-white/60 hover:text-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </a>

        {/* Login card */}
        <div className="bg-dark-light border border-white/10 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-coral" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white mb-2">
              Admin Access
            </h1>
            <p className="text-white/60 text-sm">
              Sign in to manage your portfolio content
            </p>
          </div>

          {/* Password Login Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-coral transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-coral text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-dark-light text-white/40 text-sm">or</span>
            </div>
          </div>

          {/* GitHub Login */}
          <button
            onClick={handleGitHubLogin}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </button>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-white/60 text-xs leading-relaxed">
              <strong className="text-white">Setup Required:</strong> To enable GitHub login, 
              create a GitHub OAuth App in your account settings and update the CLIENT_ID in the code.
              For now, use password: <code className="bg-white/10 px-1 rounded">admin123</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-6">
          Only authorized GitHub accounts can access the admin panel.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
