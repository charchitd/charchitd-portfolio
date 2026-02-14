import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Collaborators = () => {
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
    <section
      ref={sectionRef}
      className="section-pinned flex items-center z-50"
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-70 -translate-x-10 scale-105'
        }`}
      >
        <img
          src="/images/network_bg.jpg"
          alt="Collaborators background"
          className="w-full h-full object-cover image-grade"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-dark/70" />
      </div>

      {/* Label */}
      <div
        className={`absolute left-[6vw] top-[10vh] font-mono text-xs uppercase tracking-[0.08em] text-white/60 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
      >
        Collaborators
      </div>

      {/* Headline */}
      <div
        className={`absolute left-[6vw] top-[40vh] w-[70vw] transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <h2 className="font-display font-bold text-display-1 text-white leading-[0.95]">
          Working with
          <br />
          <span className="text-coral">research teams</span>
        </h2>
      </div>

      {/* Paragraph */}
      <div
        className={`absolute left-[6vw] top-[72vh] w-[34vw] transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <p className="text-white/70 text-lg leading-relaxed">
          From academic labs to industry R&D, I partner on experiments that prioritize reproducibility and measurable outcomes.
        </p>
      </div>

      {/* CTA */}
      <button
        className={`absolute right-[6vw] top-[74vh] btn-primary flex items-center gap-2 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '300ms' }}
        onClick={() => window.open('https://scholar.google.com', '_blank')}
      >
        Read the latest paper
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
};

export default Collaborators;
