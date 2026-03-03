import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PortfolioContext } from '../context/PortfolioContext';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { thoughts, isAdmin } = useContext(PortfolioContext);

    const post = thoughts.find(p => p.id === id);

    if (!post) {
        return <div style={{ textAlign: 'center', padding: '100px', color: 'white' }}>Post not found!</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '20px 0', maxWidth: '800px', margin: '0 auto' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <Link to="/thoughts" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                    <ArrowLeft size={18} /> Back to Thoughts
                </Link>
                {isAdmin && (
                    <button
                        onClick={() => navigate(`/admin/thoughts/${post.id}`)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
                    >
                        <Edit size={16} /> Edit Post
                    </button>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    <span style={{
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        borderRadius: '100px',
                        background: post.type === 'paper' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 210, 255, 0.2)',
                        color: post.type === 'paper' ? '#d8b4fe' : '#a5f3fc',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                    }}>
                        {post.type}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                        <Calendar size={16} /> {post.date}
                    </span>
                    <span style={{ fontSize: '0.9rem' }}>• 5-8 min read</span>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', lineHeight: 1.2 }}>{post.title}</h1>

                {/* Render Markdown smoothly */}
                <div className="markdown-content" style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}>
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'white' }} {...props} />,
                            h2: ({ node, ...props }) => <h3 style={{ fontSize: '1.4rem', marginTop: '25px', marginBottom: '10px', color: 'white' }} {...props} />,
                            h3: ({ node, ...props }) => <h4 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px', color: 'var(--accent)' }} {...props} />,
                            p: ({ node, ...props }) => <p style={{ marginBottom: '20px' }} {...props} />,
                            ul: ({ node, ...props }) => <ul style={{ marginBottom: '20px', paddingLeft: '20px' }} {...props} />,
                            li: ({ node, ...props }) => <li style={{ marginBottom: '5px' }} {...props} />
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogPost;
