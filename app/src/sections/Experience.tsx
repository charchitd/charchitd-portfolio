import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap, Microscope } from 'lucide-react';

interface ExperienceItem {
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  type: 'work' | 'education' | 'research' | 'recognition';
}

const experiences: ExperienceItem[] = [
  {
    title: 'Freelance AI Researcher & Product Builder',
    organization: 'Independent AI Product Practice',
    location: 'Remote',
    period: 'Jan 2026 – Present',
    description: 'Built and shipped Varity v0.1 (open-source on PyPI) and an MCP fairness-governance server with six callable tools used live in client engagements. Designed agentic workflows in Claude Code resulting in ~40% reduction in research effort.',
    type: 'work',
  },
  {
    title: 'Technical Product Manager',
    organization: 'DailyDumbbell',
    location: 'Bangalore, India',
    period: 'Sep 2022 – Jan 2024',
    description: 'Owned product end-to-end: lifted retention by 25% by translating raw engagement data into a re-prioritized roadmap. Secured $200,000 in credit funding via the Xartup Startup Fellowship.',
    type: 'work',
  },
  {
    title: 'Software Development Engineer (R&D)',
    organization: 'NeoSOFT Technologies',
    location: 'Bangalore, India',
    period: 'Jul 2021 – Jul 2022',
    description: 'Optimised SQL queries and backend architecture for a hospital management system serving 50K+ records — measured 30% transaction speed-up. Stack: MERN, REST API design.',
    type: 'work',
  },
  {
    title: 'MSc Business Analytics',
    organization: 'Aston Business School',
    location: 'Birmingham, UK',
    period: 'Apr 2024 – Jun 2025',
    description: 'Merit / Distinction. Master\'s-level dissertation on LLM evaluation. Coursework: Predictive Analytics, Strategic Risk Management, Data-Driven Decision Making.',
    type: 'education',
  },
  {
    title: 'B.Tech, Computer Science & Engineering',
    organization: 'IIIT',
    location: 'India',
    period: 'Aug 2017 – Jul 2021',
    description: 'First Class Honours. Coursework: Machine Learning, Software Engineering, Product Management.',
    type: 'education',
  },
  {
    title: 'Published Research — IEEE VTC 2020',
    organization: 'IEEE',
    location: 'Global',
    period: '2020',
    description: 'Peer-reviewed publication on machine-learning models for vehicular network state prediction. 35+ citations to date.',
    type: 'research',
  },
  {
    title: 'Xartup Startup Fellowship',
    organization: 'Xartup',
    location: 'India',
    period: '2023',
    description: '$200,000 in credit funding awarded for DailyDumbbell product strategy.',
    type: 'recognition',
  },
  {
    title: 'PMSchool × Paytm Insider Challenge',
    organization: 'PMSchool',
    location: 'India',
    period: '2022',
    description: 'Ranked 7th of 54 in a competitive product case study evaluation.',
    type: 'recognition',
  },
];

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(experiences.length).fill(false));
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const lineObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true);
          lineObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const lineEl = sectionRef.current?.querySelector('.timeline-line');
    if (lineEl) lineObserver.observe(lineEl);

    const observers: IntersectionObserver[] = [];
    const items = sectionRef.current?.querySelectorAll('.experience-item');
    
    items?.forEach((item, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(item);
      observers.push(observer);
    });

    return () => {
      lineObserver.disconnect();
      observers.forEach(obs => obs.disconnect());
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'research':
        return <Microscope className="w-4 h-4" />;
      case 'education':
        return <GraduationCap className="w-4 h-4" />;
      case 'recognition':
        return <Brain className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section-flowing bg-light py-[10vh] z-60"
    >
      {/* Header */}
      <div className="px-[6vw] mb-16 scroll-animate">
        <h2 className="font-display font-bold text-display-3 text-dark">
          Experience
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative px-[6vw]">
        {/* Vertical line */}
        <div
          className={`timeline-line absolute left-[10vw] top-0 w-px h-full bg-dark/20 origin-top transition-transform duration-1000 ${
            lineVisible ? 'scale-y-100' : 'scale-y-0'
          }`}
        />

        {/* Experience items */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`experience-item relative grid grid-cols-[10vw_1fr] gap-8 transition-all duration-700 ${
                visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Timeline dot */}
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center text-white z-10">
                  {getIcon(exp.type)}
                </div>
              </div>

              {/* Content */}
              <div className="pb-8 border-b border-dark/10">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-coral">
                    {exp.period}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-dark/10 text-dark/70 rounded">
                    {exp.type}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-dark mb-1">
                  {exp.title}
                </h3>
                <p className="text-dark/70 font-medium mb-2">
                  {exp.organization} · {exp.location}
                </p>
                <p className="text-dark/60 text-sm leading-relaxed max-w-2xl">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
