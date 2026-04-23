import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Save, AlertCircle, Plus, Trash2, Check, RefreshCw, LogOut, Shield, Clock } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';

const Admin = () => {
  const { profile, setProfile, experience, setExperience, projects, setProjects, isAdmin, setIsAdmin, authToken, setAuthToken, logout, API_URL } = useContext(PortfolioContext);
  const [githubUser, setGithubUser] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState('');
  const [sessionTimeLeft, setSessionTimeLeft] = useState('');

  // Auto-restore admin state from valid token
  useEffect(() => {
    if (authToken && !isAdmin) {
      setIsAdmin(true);
    }
  }, [authToken]);

  // Session countdown timer
  useEffect(() => {
    if (!authToken) {
      setSessionTimeLeft('');
      return;
    }
    const updateTimer = () => {
      try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const msLeft = payload.exp * 1000 - Date.now();
        if (msLeft <= 0) {
          setSessionTimeLeft('Expired');
          return;
        }
        const mins = Math.floor(msLeft / 60000);
        const secs = Math.floor((msLeft % 60000) / 1000);
        setSessionTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      } catch {
        setSessionTimeLeft('');
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [authToken]);

  // Helper: make an authenticated API call with auto-logout on token expiry
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      const data = await res.json().catch(() => ({}));
      if (data.error?.includes('expired') || res.status === 401) {
        logout();
        alert('Your session has expired. Please log in again.');
        throw new Error('SESSION_EXPIRED');
      }
      throw new Error(data.error || 'Unauthorized');
    }

    return res;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUser: githubUser.trim(), password })
      });

      const data = await res.json();

      if (res.ok) {
        setAuthToken(data.token);
        setIsAdmin(true);
        // Clear password from memory after successful login
        setPassword('');
        setGithubUser('');
      } else {
        setLoginError(data.error || 'Login failed.');
      }
    } catch (err) {
      setLoginError('Server error. Is the backend running?');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordChangeStatus("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus("New passwords do not match.");
      return;
    }
    // Enforce strong password requirements
    if (newPassword.length < 8) {
      setPasswordChangeStatus("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordChangeStatus("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setPasswordChangeStatus("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordChangeStatus("Password must contain at least one number.");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordChangeStatus("Password must contain at least one special character.");
      return;
    }
    setPasswordChangeStatus("Updating...");
    try {
      const res = await authFetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordChangeStatus("Password updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordChangeStatus(data.error || "Failed to update password.");
      }
    } catch (err) {
      if (err.message !== 'SESSION_EXPIRED') {
        setPasswordChangeStatus("Server error.");
      }
    }
  };

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExpChange = (id, field, value) => {
    setExperience(prev => prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addExperience = async () => {
    const newExp = { id: Date.now().toString(), role: "New Role", company: "Company", year: "202x - 202x", description: "Description..." };
    setExperience(prev => [...prev, newExp]);

    try {
      await authFetch(`${API_URL}/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
    } catch (e) {
      if (e.message !== 'SESSION_EXPIRED') {
        console.error("Failed to add experience to DB", e);
      }
    }
  };

  const deleteExperience = async (id) => {
    try {
      await authFetch(`${API_URL}/experience/${id}`, {
        method: 'DELETE',
      });
      // Only update UI after successful backend deletion
      setExperience(prev => prev.filter(exp => exp.id !== id));
    } catch (e) {
      if (e.message !== 'SESSION_EXPIRED') {
        console.error("Failed to delete experience", e);
        alert('Failed to delete experience. Please try again.');
      }
    }
  };

  const handleProjChange = (id, field, value) => {
    setProjects(prev => prev.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
  };

  const addProject = async () => {
    const newProj = { id: Date.now().toString(), title: "New Project", techStack: "Tech", link: "https://...", description: "Project description..." };
    setProjects(prev => [...prev, newProj]);

    try {
      await authFetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });
    } catch (e) {
      if (e.message !== 'SESSION_EXPIRED') {
        console.error("Failed to add project to DB", e);
      }
    }
  };

  const deleteProject = async (id) => {
    try {
      await authFetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      // Only update UI after successful backend deletion
      setProjects(prev => prev.filter(proj => proj.id !== id));
    } catch (e) {
      if (e.message !== 'SESSION_EXPIRED') {
        console.error("Failed to delete project", e);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const saveAllChanges = async () => {
    setSaveStatus('saving');
    try {
      const profileRes = await authFetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!profileRes.ok) throw new Error('Failed to save profile');

      for (let exp of experience) {
        await authFetch(`${API_URL}/experience/${exp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exp)
        });
      }

      for (let proj of projects) {
        await authFetch(`${API_URL}/projects/${proj.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proj)
        });
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);

    } catch (err) {
      if (err.message !== 'SESSION_EXPIRED') {
        console.error(err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <Shield size={48} style={{ margin: '0 auto 20px', color: '#a855f7' }} />
          <h2 style={{ marginBottom: '10px' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>
            Authenticate with your authorized GitHub account to edit your portfolio.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="GitHub Username"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              style={inputStyle}
              autoComplete="username"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
              required
            />
            {loginError && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{loginError}</p>}
            <button type="submit" style={btnStyle}>
              <Github size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Sign In
            </button>
          </form>

          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
            <AlertCircle size={14} /> 15-minute session · Backend auth
          </div>
        </motion.div>
      </div>
    );
  }

  if (!profile || !profile.name) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading Profile Data...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px 0', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {sessionTimeLeft && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: sessionTimeLeft === 'Expired' ? '#ef4444' : 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
              <Clock size={14} /> {sessionTimeLeft}
            </div>
          )}
          <button onClick={handleLogout} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Edit Profile</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          <label style={labelStyle}>Full Name
            <input name="name" value={profile.name || ''} onChange={handleProfileChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>Professional Title
            <input name="title" value={profile.title || ''} onChange={handleProfileChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>Image URL (Leave empty to use local asset)
            <input name="image" value={profile.image || ''} placeholder="https://..." onChange={handleProfileChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>Bio
            <textarea name="bio" value={profile.bio || ''} onChange={handleProfileChange} style={{ ...inputStyle, minHeight: '100px' }} />
          </label>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Change Password</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          <label style={labelStyle}>Current Password
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />
          </label>
          <label style={labelStyle}>New Password
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} autoComplete="new-password" />
          </label>
          <label style={labelStyle}>Confirm New Password
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} autoComplete="new-password" />
          </label>
          <button onClick={handleChangePassword} style={{ ...btnStyle, marginTop: '10px', background: 'rgba(255,255,255,0.1)', width: 'auto', alignSelf: 'flex-start' }}>
            Update Password
          </button>
          {passwordChangeStatus && <p style={{ color: passwordChangeStatus.includes('success') ? '#10b981' : '#ef4444', fontSize: '0.9rem', marginTop: '10px' }}>{passwordChangeStatus}</p>}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          <h2>Edit Experience</h2>
          <button onClick={addExperience} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={16} /> Add
          </button>
        </div>

        {experience.map((exp) => (
          <div key={exp.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
            <button onClick={() => deleteExperience(exp.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', paddingRight: '30px' }}>
              <input value={exp.role || ''} onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)} style={inputStyle} placeholder="Role" />
              <input value={exp.company || ''} onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)} style={inputStyle} placeholder="Company" />
            </div>
            <input value={exp.year || ''} onChange={(e) => handleExpChange(exp.id, 'year', e.target.value)} style={{ ...inputStyle, marginBottom: '15px' }} placeholder="Years (e.g. 2021 - 2023)" />
            <textarea value={exp.description || ''} onChange={(e) => handleExpChange(exp.id, 'description', e.target.value)} style={{ ...inputStyle, height: '80px' }} placeholder="Description..." />
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          <h2>Edit Projects</h2>
          <button onClick={addProject} style={{ background: 'var(--secondary)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={16} /> Add
          </button>
        </div>

        {projects.map((proj) => (
          <div key={proj.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '15px', position: 'relative', borderLeft: '4px solid var(--secondary)' }}>
            <button onClick={() => deleteProject(proj.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', paddingRight: '30px' }}>
              <input value={proj.title || ''} onChange={(e) => handleProjChange(proj.id, 'title', e.target.value)} style={inputStyle} placeholder="Project Title" />
              <input value={proj.techStack || ''} onChange={(e) => handleProjChange(proj.id, 'techStack', e.target.value)} style={inputStyle} placeholder="Tech Stack (e.g., React, Node)" />
            </div>
            <input value={proj.link || ''} onChange={(e) => handleProjChange(proj.id, 'link', e.target.value)} style={{ ...inputStyle, marginBottom: '15px' }} placeholder="Project Link or Repo URL" />
            <textarea value={proj.description || ''} onChange={(e) => handleProjChange(proj.id, 'description', e.target.value)} style={{ ...inputStyle, height: '80px' }} placeholder="Project overview..." />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 100 }}
      >
        <button
          onClick={saveAllChanges}
          disabled={saveStatus === 'saving'}
          style={{
            ...btnStyle,
            background: saveStatus === 'saved' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', gap: '10px', alignItems: 'center', padding: '15px 30px', borderRadius: '100px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: 'auto'
          }}
        >
          {saveStatus === '' && <><Save size={20} /> Save Changes to Database</>}
          {saveStatus === 'saving' && <><RefreshCw size={20} className="spin" /> Saving...</>}
          {saveStatus === 'saved' && <><Check size={20} /> Successfully Saved!</>}
          {saveStatus === 'error' && <><AlertCircle size={20} /> Save Failed</>}
        </button>
      </motion.div>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' };
const labelStyle = { display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' };
const btnStyle = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', width: '100%' };

export default Admin;
