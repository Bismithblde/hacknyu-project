const columns = ["ID", "Category", "Severity", "Agency", "Status"];
const datasetRows = [
  { id: "NYC-9921", category: "Flooding", severity: "High", agency: "DEP Sewer", status: "Open" },
  { id: "NYC-9922", category: "Pothole", severity: "Medium", agency: "DOT Street Maintenance", status: "Escalated" },
  { id: "NYC-9923", category: "Streetlight", severity: "Low", agency: "DOT Lighting", status: "Resolved" },
];

export default function DatasetPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header className="max-w-2xl space-y-2">
        <p className="text-sm uppercase tracking-widest text-emerald-500">Open data</p>
        <h2 className="text-3xl font-bold text-slate-900">Civic dataset preview</h2>
        <p className="text-slate-600">
          This table mirrors the `/dataset` API response powered by the fake data store. In a live demo,
          you can call the backend to download the JSON export.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              EXPORT READY
            </p>
            <p className="text-sm text-slate-500">Contains anonymized hazard metadata</p>
          </div>
          <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Download JSON
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {datasetRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-4 font-semibold">{row.id}</td>
                  <td className="px-4 py-4">{row.category}</td>
                  <td className="px-4 py-4">{row.severity}</td>
                  <td className="px-4 py-4">{row.agency}</td>
                  <td className="px-4 py-4">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

