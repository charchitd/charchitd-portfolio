import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Save, AlertCircle, Plus, Trash2, Check, RefreshCw } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';

const Admin = () => {
  const { profile, setProfile, experience, setExperience, projects, setProjects, isAdmin, setIsAdmin, authToken, setAuthToken, API_URL } = useContext(PortfolioContext);
  const [githubUser, setGithubUser] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState('');

  useEffect(() => {
    if (authToken && !isAdmin) {
      setIsAdmin(true);
    }
  }, [authToken]);

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
      } else {
        setLoginError(data.error || 'Login failed.');
      }
    } catch (err) {
      setLoginError('Server error. Is the backend running?');
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsAdmin(false);
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
    setPasswordChangeStatus("Updating...");
    try {
      const res = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
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
      setPasswordChangeStatus("Server error.");
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
      await fetch(`${API_URL}/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(newExp)
      });
    } catch (e) {
      console.error("Failed to add experience to DB", e);
    }
  };

  const deleteExperience = async (id) => {
    setExperience(prev => prev.filter(exp => exp.id !== id));

    try {
      await fetch(`${API_URL}/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      console.error("Failed to delete experience", e);
    }
  };

  const handleProjChange = (id, field, value) => {
    setProjects(prev => prev.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
  };

  const addProject = async () => {
    const newProj = { id: Date.now().toString(), title: "New Project", techStack: "Tech", link: "https://...", description: "Project description..." };

    setProjects(prev => [...prev, newProj]);

    try {
      await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(newProj)
      });
    } catch (e) {
      console.error("Failed to add project to DB", e);
    }
  };

  const deleteProject = async (id) => {
    setProjects(prev => prev.filter(proj => proj.id !== id));

    try {
      await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      console.error("Failed to delete project", e);
    }
  };

  const saveAllChanges = async () => {
    setSaveStatus('saving');
    try {
      const profileRes = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(profile)
      });

      if (!profileRes.ok) throw new Error('Failed to save profile');

      for (let exp of experience) {
        await fetch(`${API_URL}/experience/${exp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify(exp)
        });
      }

      for (let proj of projects) {
        await fetch(`${API_URL}/projects/${proj.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify(proj)
        });
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);

    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <Github size={48} style={{ margin: '0 auto 20px', color: 'white' }} />
          <h2 style={{ marginBottom: '10px' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>
            Authenticate with your authorized GitHub account to edit your portfolio.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Enter GitHub Username"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            {loginError && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{loginError}</p>}
            <button type="submit" style={btnStyle}>Login with GitHub</button>
          </form>

          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
            <AlertCircle size={14} /> Backend Auth Active.
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Dashboard</h1>
        <button onClick={handleLogout} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', width: 'auto' }}>Logout</button>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Edit Profile</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          <label style={labelStyle}>Full Name
            <input name="name" value={profile.name} onChange={handleProfileChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>Professional Title
            <input name="title" value={profile.title} onChange={handleProfileChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>Image URL (Leave empty to use local asset)
            <input name="image" value={profile.image || ''} placeholder="https://..." onChange={handleProfileChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>Bio
            <textarea name="bio" value={profile.bio} onChange={handleProfileChange} style={{ ...inputStyle, minHeight: '100px' }} />
          </label>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Change Password</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          <label style={labelStyle}>Current Password
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>New Password
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>Confirm New Password
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} />
          </label>
          <button onClick={handleChangePassword} style={{ ...btnStyle, marginTop: '10px', background: 'rgba(255,255,255,0.1)', width: 'auto', alignSelf: 'flex-start' }}>
            Update Password
          </button>
          {passwordChangeStatus && <p style={{ color: passwordChangeStatus.includes('success') ? '#10b981' : '#ef4444', fontSize: '0.9rem', marginTop: '10px' }}>{passwordChangeStatus}</p>}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
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
              <input value={exp.role} onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)} style={inputStyle} placeholder="Role" />
              <input value={exp.company} onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)} style={inputStyle} placeholder="Company" />
            </div>
            <input value={exp.year} onChange={(e) => handleExpChange(exp.id, 'year', e.target.value)} style={{ ...inputStyle, marginBottom: '15px' }} placeholder="Years (e.g. 2021 - 2023)" />
            <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, 'description', e.target.value)} style={{ ...inputStyle, height: '80px' }} placeholder="Description..." />
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
              <input value={proj.title} onChange={(e) => handleProjChange(proj.id, 'title', e.target.value)} style={inputStyle} placeholder="Project Title" />
              <input value={proj.techStack} onChange={(e) => handleProjChange(proj.id, 'techStack', e.target.value)} style={inputStyle} placeholder="Tech Stack (e.g., React, Node)" />
            </div>
            <input value={proj.link} onChange={(e) => handleProjChange(proj.id, 'link', e.target.value)} style={{ ...inputStyle, marginBottom: '15px' }} placeholder="Project Link or Repo URL" />
            <textarea value={proj.description} onChange={(e) => handleProjChange(proj.id, 'description', e.target.value)} style={{ ...inputStyle, height: '80px' }} placeholder="Project overview..." />
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
            display: 'flex', gap: '10px', alignItems: 'center', padding: '15px 30px', borderRadius: '100px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
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
