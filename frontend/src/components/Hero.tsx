const Hero = () => {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="main" className="hero">
      <div className="hero-inner">
        <div className="hero-logo">patch</div>
        <div className="hero-tagline">See it. Patch it.</div>
        <button className="hero-cta" onClick={scrollToAbout}>
          Start Reporting
        </button>
      </div>
    </section>
  );
};

export default Hero;

