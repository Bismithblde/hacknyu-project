import { useCallback, useEffect, useRef, useState } from "react";

export const useSideNavOverlap = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const mapSectionRef = useRef<HTMLElement | null>(null);
  const [isOnMap, setIsOnMap] = useState(false);

  const evaluateOverlap = useCallback(() => {
    const nav = navRef.current;
    const map = mapSectionRef.current;
    if (!nav || !map) return;
    const navRect = nav.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();
    const navCenter = navRect.top + navRect.height / 2;
    const overlapping = navCenter >= mapRect.top && navCenter <= mapRect.bottom;
    setIsOnMap(overlapping);
  }, []);

  useEffect(() => {
    evaluateOverlap();
    window.addEventListener("scroll", evaluateOverlap, { passive: true });
    window.addEventListener("resize", evaluateOverlap);
    return () => {
      window.removeEventListener("scroll", evaluateOverlap);
      window.removeEventListener("resize", evaluateOverlap);
    };
  }, [evaluateOverlap]);

  return { navRef, mapSectionRef, isOnMap };
};

