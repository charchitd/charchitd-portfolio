import { useState, useEffect } from 'react';
import { Menu, X, Linkedin, Github, BookOpen, Lock } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'My Thoughts', href: '#writing' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="flex items-center justify-between px-[6vw]">
          {/* Logo */}
          <a
            href="#"
            className="font-display font-bold text-sm tracking-wider text-white hover:text-coral transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            CHARCHIT DHAWAN
          </a>

          {/* Menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-coral transition-colors"
          >
            <span className="font-mono text-xs uppercase tracking-widest">Menu</span>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu content */}
        <div className="relative h-full flex flex-col justify-center px-[6vw]">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-[6vw] text-white hover:text-coral transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation links */}
          <nav className="space-y-6">
            {navLinks.map((link, index) => (
              <div
                key={link.label}
                className={`transform transition-all duration-500 ${
                  isOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="font-display text-4xl md:text-6xl font-bold text-white hover:text-coral transition-colors text-left"
                >
                  {link.label}
                </button>
              </div>
            ))}
          </nav>

          {/* Admin link */}
          <div
            className={`absolute bottom-20 left-[6vw] transition-all duration-500 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '350ms' }}
          >
            <a
              href="/admin/login"
              className="flex items-center gap-2 text-white/30 hover:text-coral transition-colors text-sm"
            >
              <Lock className="w-4 h-4" />
              Admin
            </a>
          </div>

          {/* Social links */}
          <div
            className={`absolute bottom-10 left-[6vw] flex gap-6 transition-all duration-500 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <a
              href="https://linkedin.com/in/charchit-dhawan-902232110"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-coral transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/charchitd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-coral transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-coral transition-colors"
            >
              <BookOpen className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
