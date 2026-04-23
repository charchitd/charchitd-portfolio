import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';

const EditThought = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { thoughts, setThoughts, isAdmin, authToken, API_URL } = useContext(PortfolioContext);

    const [formData, setFormData] = useState({
        title: '', date: '', type: 'blog', abstract: '', content: ''
    });
    const [saveStatus, setSaveStatus] = useState('');

    // Redirect if not admin
    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, navigate]);

    // Load existing thought if editing
    useEffect(() => {
        if (id && id !== 'new') {
            const existing = thoughts.find(t => t.id === id);
            if (existing) {
                setFormData(existing);
            }
        }
    }, [id, thoughts]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');

        const isNew = id === 'new' || !id;
        const finalId = isNew ? `thought-${Date.now()}` : formData.id;
        const payload = { ...formData, id: finalId };

        try {
            const endpoint = isNew ? `${API_URL}/thoughts` : `${API_URL}/thoughts/${finalId}`;
            const res = await fetch(endpoint, {
                method: isNew ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save');

            if (isNew) {
                setThoughts(prev => [...prev, payload]);
                navigate(`/admin/thoughts/${finalId}`, { replace: true });
            } else {
                setThoughts(prev => prev.map(t => t.id === finalId ? payload : t));
            }

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);

        } catch (err) {
            console.error(err);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    if (!isAdmin) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px 0', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/thoughts')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '20px' }}>
                <ArrowLeft size={18} /> Back to Thoughts
            </button>

            <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    {id === 'new' ? 'Draft New Post' : 'Edit Post'}
                </h1>

                <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
                    <label style={labelStyle}>Title
                        <input name="title" required value={formData.title} onChange={handleChange} style={inputStyle} placeholder="Post Title" />
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <label style={labelStyle}>Date
                            <input name="date" required value={formData.date} onChange={handleChange} style={inputStyle} placeholder="e.g. Oct 2024" />
                        </label>
                        <label style={labelStyle}>Type
                            <select name="type" value={formData.type} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                <option value="blog" style={{ background: '#111' }}>Blog</option>
                                <option value="paper" style={{ background: '#111' }}>Paper</option>
                            </select>
                        </label>
                    </div>

                    <label style={labelStyle}>Abstract
                        <textarea name="abstract" required value={formData.abstract} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="Short summary..." />
                    </label>

                    <label style={labelStyle}>Markdown Content
                        <textarea name="content" required value={formData.content} onChange={handleChange} style={{ ...inputStyle, minHeight: '400px', fontFamily: 'monospace' }} placeholder="# Your content here..." />
                    </label>

                    <button
                        type="submit"
                        disabled={saveStatus === 'saving'}
                        style={{
                            ...btnStyle,
                            background: saveStatus === 'saved' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        {saveStatus === '' && <><Save size={20} /> Save Post</>}
                        {saveStatus === 'saving' && <><RefreshCw size={20} className="spin" /> Saving...</>}
                        {saveStatus === 'saved' && 'Successfully Saved!'}
                        {saveStatus === 'error' && <><AlertCircle size={20} /> Save Failed</>}
                    </button>
                </form>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </motion.div>
    );
};

const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' };
const labelStyle = { display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 };
const btnStyle = { padding: '16px', borderRadius: '8px', color: 'white', border: 'none', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' };

export default EditThought;
