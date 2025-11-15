import { forwardRef } from "react";
import clsx from "clsx";

interface SideNavProps {
  activeOnMap?: boolean;
}

const anchorLinks = [
  { href: "#main", label: "Main" },
  { href: "#about", label: "About" },
  { href: "#report", label: "Report" },
];

const SideNav = forwardRef<HTMLDivElement, SideNavProps>(({ activeOnMap }, ref) => (
  <nav
    ref={ref}
    className={clsx(
      "fixed left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-slate-400 transition sm:flex",
      activeOnMap && "text-amber-300 drop-shadow-[0_0_12px_rgba(0,0,0,0.95)]",
    )}
  >
    {anchorLinks.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className={clsx(
          "rounded px-1 py-0.5 text-left text-current transition hover:text-amber-200",
          activeOnMap && "hover:drop-shadow-[0_0_18px_rgba(0,0,0,0.85)]",
        )}
      >
        {link.label}
      </a>
    ))}
  </nav>
));

SideNav.displayName = "SideNav";

export default SideNav;

