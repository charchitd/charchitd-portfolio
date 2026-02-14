import { useEffect, useRef, useState } from 'react';

const ResearchPillars = () => {
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
      className="section-pinned bg-dark flex items-center z-20"
    >
      {/* Label */}
      <div
        className={`absolute left-[6vw] top-[10vh] font-mono text-xs uppercase tracking-[0.08em] text-white/60 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
      >
        Research focus
      </div>

      {/* Pillar lines */}
      <div className="absolute left-[6vw] top-[26vh] w-[62vw] space-y-1">
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <h2 className="font-display font-bold text-display-2 text-white">
            Fairness in
          </h2>
        </div>
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <h2 className="font-display font-bold text-display-2 text-white">
            hiring systems
          </h2>
        </div>
        <div
          className={`flex gap-4 items-baseline transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <h2 className="font-display font-bold text-display-2 text-coral">
            Transparency
          </h2>
          <span className="font-display font-bold text-display-2 text-white">
            in AI decisions
          </span>
        </div>
        <div
          className={`flex gap-4 items-baseline transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <h2 className="font-display font-bold text-display-2 text-coral">
            Accountability
          </h2>
          <span className="font-display font-bold text-display-2 text-white">
            across the pipeline
          </span>
        </div>
      </div>

      {/* Right portrait card */}
      <div
        className={`absolute left-[72vw] top-[18vh] w-[22vw] h-[64vh] overflow-hidden border border-white/10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-20 scale-105'
        }`}
      >
        <img
          src="/images/pillars_portrait.jpg"
          alt="Research"
          className="w-full h-full object-cover image-grade"
        />
      </div>

      {/* Caption */}
      <div
        className={`absolute left-[72vw] top-[86vh] w-[22vw] transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{ transitionDelay: '600ms' }}
      >
        <p className="text-sm text-white/60 leading-relaxed">
          I design experiments and metrics that make trade-offs visible—so systems can be improved, not just deployed.
        </p>
      </div>
    </section>
  );
};

export default ResearchPillars;
