import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import profilePic from '../assets/profile.jpg';
import { PortfolioContext } from '../context/PortfolioContext';

const Home = () => {
    const { profile, experience, projects } = useContext(PortfolioContext);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', marginTop: '40px' }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    textAlign: 'center',
                    maxWidth: '800px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                    className="glass-panel"
                    style={{ padding: '10px', borderRadius: '50%', display: 'inline-block' }}
                >
                    <img
                        src={profile.image || profilePic}
                        alt="Profile"
                        style={{
                            width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)'
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', lineHeight: 1.2 }}>
                        Hi, I'm <span className="text-gradient">{profile.name}</span>
                    </h1>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 400, marginBottom: '20px' }}>
                        {profile.title}
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '30px' }}>
                        {profile.bio}
                    </p>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/thoughts">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '100px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.4)'
                                }}
                            >
                                <BookOpen size={18} /> My Thoughts
                            </motion.button>
                        </Link>

                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.95 }}
                                className="glass-panel"
                                style={{ color: 'white', padding: '14px 28px', borderRadius: '100px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                Let's Collaborate <ArrowRight size={18} />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Canvas Grid Layout for Experience & Projects */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                    width: '100%',
                    maxWidth: '1200px',
                    marginTop: '40px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '30px'
                }}
            >
                {/* Experience Canvas */}
                {experience && experience.length > 0 && (
                    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ fontSize: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>💼 Experience</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
                            {experience.map(exp => (
                                <div key={exp.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>{exp.role}</h3>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.year}</span>
                                    </div>
                                    <h4 style={{ color: 'var(--accent)', fontWeight: '500', margin: '0 0 10px 0', fontSize: '1rem' }}>{exp.company}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Canvas */}
                {projects && projects.length > 0 && (
                    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ fontSize: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>🚀 Selected Projects</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
                            {projects.map(proj => (
                                <div key={proj.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--secondary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                                        <h3 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>{proj.title}</h3>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.85rem', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s', ':hover': { background: 'var(--accent)' } }}>
                                                View <ArrowRight size={14} />
                                            </a>
                                        )}
                                    </div>
                                    <div style={{ color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '10px', fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                        {proj.techStack}
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); borderRadius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); borderRadius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }`}</style>
        </motion.div>
    );
};

export default Home;
