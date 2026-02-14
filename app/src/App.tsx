import { useEffect, useRef } from 'react';
import { AdminProvider, AdminLogin, AdminDashboard, OAuthCallback } from './admin';
import './App.css';

// Import sections
import Hero from './sections/Hero';
import ResearchPillars from './sections/ResearchPillars';
import Philosophy from './sections/Philosophy';
import SelectedWork from './sections/SelectedWork';
import Collaborators from './sections/Collaborators';
import Experience from './sections/Experience';
import Capabilities from './sections/Capabilities';
import Writing from './sections/Writing';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Navigation from './sections/Navigation';

// Main Portfolio Component
const Portfolio = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="relative">
        <Hero />
        <ResearchPillars />
        <Philosophy />
        <SelectedWork />
        <Collaborators />
        <Experience />
        <Capabilities />
        <Writing />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

// Router Component
const App = () => {
  // Simple router based on pathname
  const path = window.location.pathname;

  // Admin routes
  if (path.startsWith('/admin')) {
    return (
      <AdminProvider>
        {path === '/admin/login' && <AdminLogin />}
        {path === '/admin/dashboard' && <AdminDashboard />}
        {path === '/admin/callback' && <OAuthCallback />}
        {path === '/admin' && <AdminLogin />}
      </AdminProvider>
    );
  }

  // Main portfolio
  return <Portfolio />;
};

export default App;
