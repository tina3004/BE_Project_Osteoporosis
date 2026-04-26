import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

/* ─── Severity config (index 0–4 maps to KL Grade) ─── */
const GRADES = [
  { label: "Normal",   color: "#22c55e", bg: "bg-green-50",  border: "border-green-200", badge: "bg-green-100 text-green-800" },
  { label: "Doubtful", color: "#facc15", bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800" },
  { label: "Mild",     color: "#fb923c", bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" },
  { label: "Moderate", color: "#f87171", bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-800" },
  { label: "Severe",   color: "#b91c1c", bg: "bg-red-100",   border: "border-red-300",    badge: "bg-red-200 text-red-900" },
];

/* ─── Single horizontal probability bar ─── */
function ProbBar({ label, value, idx, isHighest }) {
  const pct = (value * 100).toFixed(1);
  const grade = GRADES[idx] ?? { color: "#94a3b8" };
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-${isHighest ? "bold" : "medium"} text-gray-700`}>
          {label}
          {isHighest && (
            <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: grade.color + "33", color: grade.color }}>
              ↑ Highest
            </span>
          )}
        </span>
        <span className={`text-sm font-bold ${isHighest ? "" : "text-gray-500"}`} style={isHighest ? { color: grade.color } : {}}>
          {pct}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: grade.color, opacity: isHighest ? 1 : 0.5 }}
        />
      </div>
    </div>
  );
}

/* ─── SVG confidence ring ─── */
function ConfRing({ confidence, color }) {
  const pct = (confidence * 100).toFixed(0);
  const r = 15.9;
  const circ = 2 * Math.PI * r;
  const dash = (confidence * circ).toFixed(1);
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-16 h-16 rotate-[-90deg]">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
        <circle
          cx="18" cy="18" r={r} fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-extrabold text-gray-800">{pct}%</span>
      </div>
    </div>
  );
}

/* ─── Individual result card ─── */
function ResultCard({ result, index }) {
  const probs = result.all_probs || {};
  const entries = Object.entries(probs);

  // Find highest probability entry and its grade index
  let highestIdx = 0;
  let highestVal = -1;
  entries.forEach(([, v], i) => { if (v > highestVal) { highestVal = v; highestIdx = i; } });
  const grade = GRADES[highestIdx] ?? GRADES[0];

  return (
    <div className={`bg-white rounded-2xl border-2 ${grade.border} shadow-md overflow-hidden`}>
      {/* Header */}
      <div className={`${grade.bg} px-5 py-4 border-b ${grade.border} flex items-center justify-between`}>
        <div>
          <p className="text-xs text-gray-400 font-medium">Scan {index + 1}</p>
          <p className="text-sm font-semibold text-gray-700 truncate max-w-[160px]" title={result.fileName}>
            {result.fileName}
          </p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${grade.badge}`}>
          {result.prediction}
        </span>
      </div>

      {/* Preview Image */}
      {result.previewUrl && (
        <div className="h-44 bg-gray-100 overflow-hidden flex items-center justify-center">
          <img src={result.previewUrl} alt="X-ray" className="object-cover w-full h-full" />
        </div>
      )}

      {/* Confidence Ring + label */}
      <div className="flex items-center gap-4 px-5 pt-4">
        <ConfRing confidence={result.confidence} color={grade.color} />
        <div>
          <p className="text-lg font-extrabold text-gray-800">{result.prediction}</p>
          <p className="text-xs text-gray-500">AI Confidence Score</p>
        </div>
      </div>

      {/* Probability Bars */}
      {entries.length > 0 && (
        <div className="px-5 pt-4 pb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Class Probabilities</p>
          {entries.map(([label, value], i) => (
            <ProbBar key={label} label={label} value={value} idx={i} isHighest={i === highestIdx} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Results page ─── */
export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  /* Guard: if user lands here directly with no data */
  if (!state?.results?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No results to display</h2>
          <p className="text-gray-500 mb-6">Please upload an X-ray first.</p>
          <Link to="/upload" className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition shadow">
            Go to Upload
          </Link>
        </div>
      </div>
    );
  }

  const { patientName, results } = state;
  const avgConf = results.reduce((s, r) => s + r.confidence, 0) / results.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Analysis Report</p>
            <h2 className="text-3xl font-extrabold text-gray-800">{patientName}</h2>
            <p className="text-gray-400 text-sm mt-1">{results.length} scan{results.length > 1 ? "s" : ""} analysed</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition shadow text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Upload
            </button>
            <Link
              to="/history"
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-teal-600">{results.length}</p>
            <p className="text-sm text-gray-500 mt-1">Scans</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-teal-600">{(avgConf * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">Avg. Confidence</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center col-span-2 md:col-span-1">
            <p className="text-2xl font-extrabold text-gray-800 truncate">{results[0]?.prediction ?? "—"}</p>
            <p className="text-sm text-gray-500 mt-1">Primary Finding</p>
          </div>
        </div>

        {/* Result Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((result, idx) => (
            <ResultCard key={idx} result={result} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
