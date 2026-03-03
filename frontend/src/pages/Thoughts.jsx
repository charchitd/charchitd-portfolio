import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, Calendar, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';

const Thoughts = () => {
    const [activeTab, setActiveTab] = useState('all');
    const { thoughts, setThoughts, isAdmin, authToken, API_URL } = useContext(PortfolioContext);
    const navigate = useNavigate();

    const filteredPapers = activeTab === 'all' ? thoughts : thoughts.filter(p => p.type === activeTab);

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm("Are you sure you want to delete this post?")) {
            setThoughts(prev => prev.filter(t => t.id !== id));
            try {
                await fetch(`${API_URL}/thoughts/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '20px 0' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My <span className="text-gradient">Thoughts</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore my latest academic papers, philosophical musings, and perspectives on building scalable tech products.
                </p>
                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin/thoughts/new')}
                        style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
                    >
                        <Plus size={18} /> New Post
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
                {['all', 'paper', 'blog'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '100px',
                            border: `1px solid ${activeTab === tab ? 'var(--accent)' : 'var(--glass-border)'}`,
                            background: activeTab === tab ? 'rgba(0, 210, 255, 0.1)' : 'var(--glass-bg)',
                            color: activeTab === tab ? 'var(--accent)' : 'white',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: 500,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {tab === 'all' ? 'All Thoughts' : tab === 'paper' ? 'Research Papers' : 'Tech Blogs'}
                    </button>
                ))}
            </div>

            <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <AnimatePresence>
                    {filteredPapers.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card"
                            style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}
                        >
                            {isAdmin && (
                                <div style={{ position: 'absolute', top: '25px', right: '25px', display: 'flex', gap: '10px' }}>
                                    <button onClick={(e) => { e.preventDefault(); navigate(`/admin/thoughts/${item.id}`); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={(e) => handleDelete(item.id, e)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: isAdmin ? '80px' : '0' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            padding: '4px 10px',
                                            borderRadius: '100px',
                                            background: item.type === 'paper' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 210, 255, 0.2)',
                                            color: item.type === 'paper' ? '#d8b4fe' : '#a5f3fc',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            letterSpacing: '0.05em'
                                        }}>
                                            {item.type}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Calendar size={14} /> {item.date}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'white' }}>{item.title}</h3>
                                </div>
                                {!isAdmin && (
                                    <Link to={`/thoughts/${item.id}`} style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                                        {item.type === 'paper' ? <FileText size={20} /> : <ExternalLink size={20} />}
                                    </Link>
                                )}
                            </div>

                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{item.abstract}</p>

                            <div style={{ marginTop: '5px' }}>
                                <Link to={`/thoughts/${item.id}`} style={{
                                    color: 'var(--accent)',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    width: 'fit-content'
                                }}>
                                    Read Full {item.type === 'paper' ? 'Paper' : 'Article'} <ChevronRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default Thoughts;
