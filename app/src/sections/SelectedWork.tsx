import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Brain, Shield, FileText, Radio } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  link?: string;
}

const projects: Project[] = [
  {
    title: 'Fraud Detection with Federated Learning',
    description: 'Privacy-preserving experiment under client heterogeneity. Implemented multi-client federated pipeline comparing FedAvg vs FedProx.',
    tags: ['Federated Learning', 'Privacy', 'Python'],
    icon: <Shield className="w-6 h-6" />,
    link: '#',
  },
  {
    title: 'AI Governance Quantitative Framework',
    description: 'Measuring fairness, accountability, transparency, robustness, privacy, inclusivity, and explainability metrics for ethical governance.',
    tags: ['AI Governance', 'Metrics', 'Research'],
    icon: <Brain className="w-6 h-6" />,
    link: '#',
  },
  {
    title: 'Semi-Supervised Research Classification',
    description: 'Co-training + LLMs to reduce manual labeling. Efficient classification of empirical research using semi-supervised approaches.',
    tags: ['NLP', 'LLM', 'Co-training'],
    icon: <FileText className="w-6 h-6" />,
    link: '#',
  },
  {
    title: 'Path Loss Prediction (VTC2020)',
    description: 'ML-based wireless planning for smart campuses. Published conference paper on ANN and Random Forest for 5G path loss prediction.',
    tags: ['ML', '5G', 'Published'],
    icon: <Radio className="w-6 h-6" />,
    link: '#',
  },
];

const SelectedWork = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(projects.length).fill(false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const cards = sectionRef.current?.querySelectorAll('.project-card');
    
    cards?.forEach((card, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-flowing bg-dark py-[10vh] z-40"
    >
      {/* Header */}
      <div className="px-[6vw] mb-12 scroll-animate">
        <h2 className="font-display font-bold text-display-3 text-white">
          Selected work
        </h2>
      </div>

      {/* Projects grid */}
      <div className="px-[6vw] grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`project-card group p-6 md:p-8 rounded-xl border border-white/10 bg-dark-light card-hover cursor-pointer transition-all duration-700 ${
              visibleCards[index] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-98'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-coral/10 text-coral">
                {project.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-xl text-white mb-2 group-hover:text-coral transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-white/5 text-white/70 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    className="inline-flex items-center gap-2 text-coral text-sm font-medium hover:underline"
                  >
                    View project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SelectedWork;
