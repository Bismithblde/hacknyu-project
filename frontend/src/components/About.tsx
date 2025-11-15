import { useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section js-animate-on-scroll">
      <div className="about-inner">
        <div className="about-tag">About Patch</div>
        <h2 className="about-title">A Modern Way to See and Fix the World!</h2>
        <p className="about-text">
          This project provides a powerful, modern, and accessible approach to
          environmental reporting. It merges sustainability with cutting-edge AI
          agent technology, multimodal analysis, gamification, and real-world
          action. With just a photo and a sentence, anyone can help improve
          their community. This system transforms civic engagement,
          environmental stewardship, and AI interaction into one seamless
          ecosystem.
        </p>
        <div className="about-chips">
          <span className="chip chip-outline">AI-powered</span>
          <span className="chip chip-gold">Civic impact</span>
          <span className="chip chip-outline">Gamified engagement</span>
        </div>
      </div>
    </section>
  );
};

export default About;

