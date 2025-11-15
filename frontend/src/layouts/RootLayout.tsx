import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/report", label: "Report" },
  { to: "/pins", label: "Pins" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/dataset", label: "Dataset" },
];

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-400">
              Patch Civic Lab
            </p>
            <h1 className="text-2xl font-bold text-slate-100">Civic Hazard Hub</h1>
          </div>
          <nav className="flex gap-2 text-sm font-medium text-slate-300">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    isActive 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                      : "hover:bg-slate-800 hover:text-slate-100"
                  }`
                }
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

