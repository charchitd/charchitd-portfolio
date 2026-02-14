import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Using Formspree for form submission (free service)
      // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/xnqevwdr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      // Fallback: Open email client
      const mailtoLink = `mailto:charchitdhawan@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:charchitdhawan@gmail.com';
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-pinned bg-dark flex items-center z-90"
    >
      {/* Left portrait card */}
      <div
        className={`absolute left-[6vw] top-[18vh] w-[40vw] h-[64vh] overflow-hidden border border-white/10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-20 scale-105'
        }`}
      >
        <img
          src="/images/hero_portrait.jpg"
          alt="Charchit Dhawan"
          className="w-full h-full object-cover image-grade"
        />
      </div>

      {/* Right content - Contact Form */}
      <div className="absolute left-[54vw] top-[12vh] w-[40vw]">
        {/* Headline */}
        <div
          className={`mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}
        >
          <h2 className="font-display font-bold text-display-1 text-white leading-[0.92]">
            Let's
            <br />
            <span className="text-coral">connect</span>
          </h2>
        </div>

        {/* Paragraph */}
        <div
          className={`mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="text-white/70 leading-relaxed">
            If you're working on fairness, simulation, or trustworthy AI—let's talk.
          </p>
        </div>

        {/* Contact Form */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {isSubmitted ? (
            <div className="bg-coral/10 border border-coral/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-coral mx-auto mb-4" />
              <h3 className="font-display font-semibold text-xl text-white mb-2">Message Sent!</h3>
              <p className="text-white/60">Thank you for reaching out. I'll get back to you soon.</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-coral hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-coral transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-coral transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-1">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-dark">Select a topic</option>
                  <option value="Research Collaboration" className="bg-dark">Research Collaboration</option>
                  <option value="PhD Opportunities" className="bg-dark">PhD Opportunities</option>
                  <option value="Consulting" className="bg-dark">Consulting</option>
                  <option value="Speaking Invitation" className="bg-dark">Speaking Invitation</option>
                  <option value="Other" className="bg-dark">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-coral transition-colors resize-none"
                  placeholder="Tell me about your project or question..."
                />
              </div>

              {error && (
                <p className="text-coral text-sm">{error}</p>
              )}
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleEmailClick}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Micro line - bottom right */}
      <div
        className={`absolute right-[6vw] bottom-[10vh] font-mono text-xs text-white/40 flex items-center gap-2 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '500ms' }}
      >
        <MapPin className="w-3 h-3" />
        charchitdhawan@gmail.com · London, UK
      </div>
    </section>
  );
};

export default Contact;
