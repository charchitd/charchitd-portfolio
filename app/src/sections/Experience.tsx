import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap, Microscope } from 'lucide-react';

interface ExperienceItem {
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  type: 'work' | 'education' | 'research';
}

const experiences: ExperienceItem[] = [
  {
    title: 'Graduate Research Assistant',
    organization: 'Aston Business School',
    location: 'Birmingham, UK',
    period: 'May 2024 - June 2025',
    description: 'Conducted advanced research on LLMs and semi-supervised learning to automate document classification. Developed efficient NLP pipelines.',
    type: 'research',
  },
  {
    title: 'Technical Product Manager',
    organization: 'DailyDumbbell',
    location: 'Bangalore, India',
    period: 'Sep 2022 - Feb 2024',
    description: 'Led development of B2B2C SaaS fitness product. Managed cross-functional teams and drove strategic decision-making.',
    type: 'work',
  },
  {
    title: 'Visiting Researcher',
    organization: 'CiSTUP, IISc',
    location: 'Bangalore, India',
    period: 'Oct 2022 - Dec 2022',
    description: 'Researched smartphone-based Driving Behaviour and Events Analysis. Worked on real-world behavioral data.',
    type: 'research',
  },
  {
    title: 'Software Engineer, R&D',
    organization: 'NeoSOFT Technologies',
    location: 'Bangalore, India',
    period: 'July 2021 - July 2022',
    description: 'Specialized in blockchain development with Hyperledger Fabric. Built secure REST APIs and smart contracts.',
    type: 'work',
  },
  {
    title: 'Research Intern',
    organization: 'Lancaster University',
    location: 'United Kingdom',
    period: 'Jan 2021 - June 2021',
    description: 'Synthetic Data Generation using Unity3D and Deep Learning. Created virtual city environments for computer vision research.',
    type: 'research',
  },
  {
    title: 'MSc Business Analytics',
    organization: 'Aston Business School',
    location: 'Birmingham, UK',
    period: '2024 - 2025',
    description: 'Focus on Statistics, Machine Learning, Data Mining, and Analytical Risk Management.',
    type: 'education',
  },
  {
    title: 'B.Tech Computer Science',
    organization: 'IIIT Naya Raipur',
    location: 'India',
    period: '2017 - 2021',
    description: 'Core AI and ML, Web Development, Problem Solving, and Innovation.',
    type: 'education',
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
