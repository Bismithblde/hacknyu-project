const leaders = [
  { name: "Nadia Rivera", points: 480, level: "Guardian", badges: ["Rapid Responder", "Top Verifier"] },
  { name: "Theo Winters", points: 365, level: "Inspector", badges: ["Data Steward"] },
  { name: "Jai Patel", points: 220, level: "Ranger", badges: ["Neighborhood Watch"] },
];

export default function LeaderboardPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header>
        <p className="text-sm uppercase tracking-widest text-emerald-500">
          Recognition
        </p>
        <h2 className="text-3xl font-bold text-slate-900">Trust leaderboard</h2>
        <p className="mt-2 text-slate-600">
          Demonstrate how points, badges, and trust levels reward accurate reporting.
        </p>
      </header>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Level</th>
              <th className="px-6 py-3">Points</th>
              <th className="px-6 py-3">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
            {leaders.map((leader) => (
              <tr key={leader.name}>
                <td className="px-6 py-4 font-semibold">{leader.name}</td>
                <td className="px-6 py-4">{leader.level}</td>
                <td className="px-6 py-4">{leader.points}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {leader.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

