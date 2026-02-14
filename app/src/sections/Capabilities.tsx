import { useEffect, useRef, useState } from 'react';
import { Code, Database, Brain, LineChart, FileCode, Microscope } from 'lucide-react';

const skills = [
  { name: 'Python & SQL', icon: <Code className="w-5 h-5" />, level: 95 },
  { name: 'Machine Learning', icon: <Brain className="w-5 h-5" />, level: 90 },
  { name: 'NLP & LLMs', icon: <FileCode className="w-5 h-5" />, level: 88 },
  { name: 'Data Analysis', icon: <LineChart className="w-5 h-5" />, level: 92 },
  { name: 'PyTorch/TensorFlow', icon: <Database className="w-5 h-5" />, level: 85 },
  { name: 'Research Methods', icon: <Microscope className="w-5 h-5" />, level: 90 },
];

const Capabilities = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSkills, setVisibleSkills] = useState<boolean[]>(new Array(skills.length).fill(false));

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

  useEffect(() => {
    if (isVisible) {
      skills.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSkills(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 500 + index * 100);
      });
    }
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex items-center justify-center z-70"
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-60 scale-110'
        }`}
      >
        <img
          src="/images/capabilities_bg.jpg"
          alt="Capabilities background"
          className="w-full h-full object-cover image-grade"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-dark/75" />
      </div>

      {/* Label */}
      <div
        className={`absolute top-[10vh] left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.08em] text-white/60 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
      >
        Capabilities
      </div>

      {/* Headline */}
      <div
        className={`relative z-10 text-center px-[6vw] transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
        style={{ top: '-15vh' }}
      >
        <h2 className="font-display font-bold text-display-1 text-white leading-[0.95]">
          I can
          <br />
          <span className="text-coral">do it all</span>
        </h2>
      </div>

      {/* Paragraph */}
      <div
        className={`absolute top-[52vh] left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <p className="text-center text-white/70 text-lg leading-relaxed">
          End-to-end research workflows: experimental design, reproducible pipelines, 
          statistical analysis, and clear reporting—translating complex findings into decisions.
        </p>
      </div>

      {/* Skills */}
      <div
        className={`absolute bottom-[12vh] left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '400ms' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 ${
                visibleSkills[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="text-coral">{skill.icon}</div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{skill.name}</p>
                <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral rounded-full transition-all duration-1000"
                    style={{ 
                      width: visibleSkills[index] ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 100}ms`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
