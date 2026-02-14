import { useEffect, useRef, useState } from 'react';

const Philosophy = () => {
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
      className="section-pinned flex items-center justify-center z-30"
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-60 scale-110'
        }`}
      >
        <img
          src="/images/philosophy_bg.jpg"
          alt="Philosophy background"
          className="w-full h-full object-cover image-grade"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-dark/60" />
      </div>

      {/* Label */}
      <div
        className={`absolute top-[10vh] left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.08em] text-white/60 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
      >
        Philosophy
      </div>

      {/* Headline */}
      <div
        className={`relative z-10 text-center px-[6vw] transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
        style={{ top: '-5vh' }}
      >
        <h2 className="font-display font-bold text-display-1 text-white leading-[0.95]">
          <span className="block">Building AI that</span>
          <span className="block text-coral">earns trust</span>
        </h2>
      </div>

      {/* Paragraph */}
      <div
        className={`absolute bottom-[12vh] left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        <p className="text-center text-white/70 text-lg leading-relaxed">
          Trust isn't a feature you add later. It's the result of clear metrics, reproducible experiments, 
          and designs that account for real-world trade-offs between fairness, privacy, and performance.
        </p>
      </div>
    </section>
  );
};

export default Philosophy;
