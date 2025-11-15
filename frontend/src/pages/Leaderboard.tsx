import { useEffect, useState } from "react";
import api from "../utils/api";
import type { LeaderboardEntry } from "../types/api";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.leaderboard.list(100);
        setLeaders(data as LeaderboardEntry[]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load leaderboard";
        setError(message);
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"></div>
            <p className="text-slate-600">Loading leaderboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-900">Failed to load leaderboard</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : leaders.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <p className="text-slate-600">No leaderboard data available yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Points</th>
                <th className="px-6 py-3">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {leaders.map((leader, index) => (
                <tr key={leader.userId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-500">#{index + 1}</td>
                  <td className="px-6 py-4 font-semibold">{leader.name}</td>
                  <td className="px-6 py-4">{leader.level}</td>
                  <td className="px-6 py-4 font-medium text-emerald-600">{leader.points}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {leader.badges && leader.badges.length > 0 ? (
                        leader.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                          >
                            {badge}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">No badges yet</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

