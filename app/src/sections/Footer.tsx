import { useEffect, useRef, useState } from 'react';
import { Linkedin, Github, BookOpen, Heart } from 'lucide-react';

const Footer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="section-flowing bg-dark py-12 z-100"
    >
      {/* Hairline */}
      <div className="w-full h-px bg-white/10 mb-8" />

      {/* Content */}
      <div
        className={`px-[6vw] flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Copyright */}
        <div className="font-mono text-xs text-white/40">
          © {new Date().getFullYear()} Charchit Dhawan
        </div>

        {/* Social links */}
        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/in/charchit-dhawan-902232110"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-coral transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span className="text-sm">LinkedIn</span>
          </a>
          <a
            href="https://scholar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-coral transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Scholar</span>
          </a>
          <a
            href="https://github.com/charchitd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-coral transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="text-sm">GitHub</span>
          </a>
        </div>

        {/* Credit */}
        <div className="flex items-center gap-1 text-white/40 text-xs">
          Built with <Heart className="w-3 h-3 text-coral" /> care
        </div>
      </div>
    </footer>
  );
};

export default Footer;
