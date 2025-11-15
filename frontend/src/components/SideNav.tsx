import { useEffect, useState } from "react";

const SideNav = () => {
  const [isOnMap, setIsOnMap] = useState(false);

  useEffect(() => {
    const sideNav = document.querySelector(".side-nav");
    const mapElement = document.getElementById("map");

    const updateNavColorOnScroll = () => {
      if (!sideNav || !mapElement) return;

      const navRect = sideNav?.getBoundingClientRect();
      const mapRect = mapElement.getBoundingClientRect();

      const navCenterY = (navRect?.top || 0) + (navRect?.height || 0) / 2;
      const isOverMap =
        navCenterY >= mapRect.top && navCenterY <= mapRect.bottom;

      setIsOnMap(isOverMap);
    };

    window.addEventListener("scroll", updateNavColorOnScroll);
    window.addEventListener("resize", updateNavColorOnScroll);
    updateNavColorOnScroll();

    return () => {
      window.removeEventListener("scroll", updateNavColorOnScroll);
      window.removeEventListener("resize", updateNavColorOnScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`side-nav ${isOnMap ? "side-nav--on-map" : ""}`}>
      <a
        href="#main"
        className="side-nav-link"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("main");
        }}
      >
        Main
      </a>
      <a
        href="#about"
        className="side-nav-link"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("about");
        }}
      >
        About
      </a>
      <a
        href="#report"
        className="side-nav-link"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("report");
        }}
      >
        Report
      </a>
    </nav>
  );
};

export default SideNav;
