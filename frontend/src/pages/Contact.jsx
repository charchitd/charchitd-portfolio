import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';

const Contact = () => {
    const { profile } = useContext(PortfolioContext);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // Using FormSubmit for free, backend-less email forwarding to the profile's email
            const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    _subject: `New Portfolio Message: ${formData.subject}`,
                })
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }

        setTimeout(() => { if (status !== 'error') setStatus('idle'); }, 4000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '20px 0' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Get In <span className="text-gradient">Touch</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Open for collaborations, speaking engagements, and research discussions.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: 'rgba(138, 43, 226, 0.2)', padding: '15px', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Email</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: 'rgba(0, 210, 255, 0.2)', padding: '15px', borderRadius: '50%', color: 'var(--accent)' }}>
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Location</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{profile.location}</p>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '50%', color: 'white' }}>
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Phone / Office</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{profile.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '25px' }}>Send a Message</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} style={inputStyle} />
                            <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} style={inputStyle} />
                        </div>
                        <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} style={inputStyle} />
                        <textarea name="message" placeholder="Your Message..." required rows="5" value={formData.message} onChange={handleChange} style={{ ...inputStyle, resize: 'none' }} />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={status === 'submitting'}
                            style={{
                                background: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: status === 'submitting' ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', transition: 'background 0.3s ease'
                            }}
                        >
                            {status === 'idle' && <><Send size={18} /> Send Message</>}
                            {status === 'submitting' && 'Sending...'}
                            {status === 'success' && 'Message Sent Successfully!'}
                            {status === 'error' && 'Failed to Send. Try again.'}
                        </motion.button>
                        {status === 'success' && (
                            <p style={{ fontSize: '0.8rem', color: '#10b981', textAlign: 'center' }}>
                                *If this is the first submission, you must confirm your email domain via FormSubmit.*
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

const inputStyle = { width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' };
export default Contact;
