import { useEffect, useRef, useState } from 'react';
import { Linkedin, Github, BookOpen, ArrowRight, Mail } from 'lucide-react';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger load animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToWork = () => {
    const element = document.querySelector('#work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-dark flex items-center z-10"
    >
      {/* Vignette */}
      <div className="vignette" />

      {/* Micro tag - top left */}
      <div
        className={`absolute left-[6vw] top-[10vh] font-mono text-xs uppercase tracking-[0.08em] text-white/60 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        Researcher / PhD Applicant
      </div>

      {/* Socials - bottom left */}
      <div
        className={`absolute left-[6vw] bottom-[10vh] flex flex-col gap-4 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
        style={{ transitionDelay: '800ms' }}
      >
        <a
          href="https://linkedin.com/in/charchit-dhawan-902232110"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-coral transition-colors"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        <a
          href="https://github.com/charchitd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-coral transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href="https://scholar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-coral transition-colors"
        >
          <BookOpen className="w-4 h-4" />
        </a>
      </div>

      {/* Left portrait card */}
      <div
        className={`absolute left-[6vw] top-[18vh] w-[40vw] h-[64vh] overflow-hidden border border-white/10 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-20 scale-105'
        }`}
      >
        <img
          src="/images/hero_portrait.jpg"
          alt="Charchit Dhawan"
          className="w-full h-full object-cover image-grade"
        />
      </div>

      {/* Right content */}
      <div className="absolute left-[54vw] top-[22vh] w-[40vw]">
        {/* Headline */}
        <div className="mb-8">
          <h1 
            className={`font-display font-bold text-display-1 text-white leading-[0.92] transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <span className="inline-block">Charchit</span>
            <br />
            <span className="inline-block">Dhawan</span>
          </h1>
        </div>

        {/* Subheadline */}
        <div 
          className={`mb-10 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-lg md:text-xl text-white/70 font-light">
            Responsible AI · Fairness · Transparency · Governance
          </p>
        </div>

        {/* CTA buttons */}
        <div 
          className={`flex flex-wrap gap-4 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <button onClick={scrollToWork} className="btn-primary flex items-center gap-2">
            View selected work
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={scrollToContact} className="btn-secondary flex items-center gap-2">
            Get in touch
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
