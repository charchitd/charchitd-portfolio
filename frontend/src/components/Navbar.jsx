import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Code, Home, User, Mail, BookOpen, Settings } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { profile } = useContext(PortfolioContext);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'My Thoughts', path: '/thoughts', icon: <BookOpen size={18} /> },
        { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
        // The Admin link has been hidden for security reasons. Users must type /admin manually.
    ];

    const closeMenu = () => setIsOpen(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s ease',
                padding: scrolled ? '10px 20px' : '20px',
            }}
        >
            <div
                className="glass-panel"
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', maxWidth: '1200px', margin: '0 auto', borderRadius: '100px',
                }}
            >
                <Link
                    to="/"
                    onDoubleClick={() => navigate('/admin')}
                    title="Double-click to access Admin Dashboard"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '1.2rem', cursor: 'pointer', userSelect: 'none' }}
                >
                    <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Code size={20} color="white" />
                    </div>
                    {profile.name}
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'none' }} className="desktop-menu">
                    <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center' }}>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 500,
                                        color: location.pathname === link.path ? 'var(--accent)' : 'var(--text-main)',
                                        opacity: location.pathname === link.path ? 1 : 0.8,
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.opacity = 1; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = location.pathname === link.path ? 'var(--accent)' : 'var(--text-main)'; e.currentTarget.style.opacity = location.pathname === link.path ? 1 : 0.8; }}
                                >
                                    {link.icon} {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="glass-panel"
                    style={{ position: 'absolute', top: '100%', left: '20px', right: '20px', marginTop: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name} to={link.path} onClick={closeMenu}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '12px',
                                background: location.pathname === link.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: location.pathname === link.path ? 'var(--accent)' : 'white'
                            }}
                        >
                            {link.icon} {link.name}
                        </Link>
                    ))}
                </motion.div>
            )}

            <style>{`@media (min-width: 768px) { .desktop-menu { display: block !important; } .mobile-toggle { display: none !important; } }`}</style>
        </motion.nav>
    );
};

export default Navbar;
