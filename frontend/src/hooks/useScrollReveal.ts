import { useEffect } from "react";

export const useScrollReveal = (selector = "[data-animate]") => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!("IntersectionObserver" in window) || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
};

