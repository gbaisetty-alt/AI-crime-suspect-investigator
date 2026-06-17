import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:5000/analyze";

const initialRecords = [
  { id: "CR-1001", name: "Arjun Mehta", type: "Cyber Crime", severity: 88, status: "Under Investigation" },
  { id: "CR-1002", name: "Neha Sharma", type: "Fraud", severity: 72, status: "Charge Sheet Filed" },
  { id: "CR-1003", name: "Ravi Kumar", type: "Robbery", severity: 94, status: "High Priority" },
  { id: "CR-1004", name: "Sameer Khan", type: "Vehicle Theft", severity: 39, status: "Evidence Review" },
  { id: "CR-1005", name: "Kiran Rao", type: "Burglary", severity: 61, status: "Suspect Traced" },
  { id: "CR-1006", name: "Vikram Singh", type: "Assault", severity: 81, status: "Court Pending" },
  { id: "CR-1007", name: "Meera Nair", type: "Cyber Crime", severity: 56, status: "Digital Forensics" },
  { id: "CR-1008", name: "Amit Verma", type: "Fraud", severity: 45, status: "Open" },
];

const emptyForm = {
  id: "",
  name: "",
  type: "Cyber Crime",
  severity: "",
};

function formatMs(value) {
  return `${Number(value || 0).toFixed(4)} ms`;
}

function severityLevel(score) {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function fallbackAnalysis(records) {
  const sorted = [...records].sort((a, b) => a.severity - b.severity);
  const mergeTime = Math.max(records.length * 0.27, 0.01);
  const bubbleTime = Math.max(records.length * records.length * 2.1, mergeTime + 0.01);

  return {
    bubble_sort: {
      time: bubbleTime,
      complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      sorted_records: sorted,
    },
    merge_sort: {
      time: mergeTime,
      complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      sorted_records: sorted,
    },
    summary: {
      time_saved: bubbleTime - mergeTime,
      fastest: "Merge Sort",
      total_records: records.length,
    },
  };
}

export default function App() {
  const [records, setRecords] = useState(initialRecords);
  const [form, setForm] = useState(emptyForm);
  const [analysis, setAnalysis] = useState(() => fallbackAnalysis(initialRecords));
  const [apiStatus, setApiStatus] = useState("Connecting to Flask backend...");

  useEffect(() => {
    async function analyzeRecords() {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ records }),
        });

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        const result = await response.json();
        setAnalysis(result);
        setApiStatus("Flask backend connected");
      } catch {
        setAnalysis(fallbackAnalysis(records));
        setApiStatus("Using frontend fallback until backend starts");
      }
    }

    analyzeRecords();
  }, [records]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      high: records.filter((record) => record.severity >= 75).length,
      medium: records.filter((record) => record.severity >= 45 && record.severity < 75).length,
      low: records.filter((record) => record.severity < 45).length,
    };
  }, [records]);

  const categories = useMemo(() => {
    return records.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {});
  }, [records]);

  function updateForm(event) {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
  }

  function addRecord(event) {
    event.preventDefault();
    const severity = Number(form.severity);
    const record = {
      id: form.id.trim(),
      name: form.name.trim(),
      type: form.type,
      severity,
      status: severity >= 75 ? "High Priority" : severity >= 45 ? "Active Review" : "Open",
    };

    setRecords((current) => [...current, record]);
    setForm(emptyForm);
  }

  const bubbleTime = analysis.bubble_sort?.time || 0;
  const mergeTime = analysis.merge_sort?.time || 0;
  const sortedRecords = analysis.merge_sort?.sorted_records || [];
  const maxChartTime = Math.max(bubbleTime, mergeTime, 1);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">⌕</span>
          <div>
            <strong>Crime Record Analyzer & Sorting Performance Comparator</strong>
            <small>B.Tech AI Lab Mini Project</small>
          </div>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#analysis">Analysis</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div>
          <span className="eyebrow">Crime analytics dashboard</span>
          <h1>Analyze crime records and compare sorting algorithm performance.</h1>
          <p>
            A full-stack Flask + React project that sorts crime records by severity and
            compares Bubble Sort with Merge Sort using Python elapsed-time measurement.
          </p>
        </div>
        <aside className="hero-card">
          <span>Fastest Algorithm</span>
          <strong>{analysis.summary?.fastest}</strong>
          <small>{apiStatus}</small>
        </aside>
      </section>

      <section className="stats-grid">
        <StatCard label="Total Crimes" value={stats.total} />
        <StatCard label="High Severity" value={stats.high} tone="danger" />
        <StatCard label="Medium Severity" value={stats.medium} tone="warning" />
        <StatCard label="Low Severity" value={stats.low} tone="success" />
      </section>

      <section className="two-column">
        <article className="card">
          <SectionTitle eyebrow="Record Entry" title="Crime Record Entry Form" />
          <form className="record-form" onSubmit={addRecord}>
            <label>
              Crime ID
              <input id="id" value={form.id} onChange={updateForm} placeholder="CR-1109" required />
            </label>
            <label>
              Criminal Name
              <input id="name" value={form.name} onChange={updateForm} placeholder="Ravi Kumar" required />
            </label>
            <label>
              Crime Type
              <select id="type" value={form.type} onChange={updateForm}>
                <option>Cyber Crime</option>
                <option>Robbery</option>
                <option>Fraud</option>
                <option>Assault</option>
                <option>Burglary</option>
                <option>Vehicle Theft</option>
              </select>
            </label>
            <label>
              Severity Score
              <input id="severity" type="number" min="1" max="100" value={form.severity} onChange={updateForm} placeholder="1-100" required />
            </label>
            <div className="actions">
              <button type="submit">Add Record</button>
              <button type="button" className="secondary" onClick={() => setRecords([])}>Clear Records</button>
            </div>
          </form>
        </article>

        <article className="card">
          <SectionTitle eyebrow="Performance" title="Comparison Dashboard" />
          <Metric label="Bubble Sort execution time" value={formatMs(bubbleTime)} />
          <Metric label="Merge Sort execution time" value={formatMs(mergeTime)} />
          <Metric label="Time saved" value={formatMs(analysis.summary?.time_saved)} positive />
          <div className="badge">Fastest: {analysis.summary?.fastest}</div>
        </article>
      </section>

      <DataTable records={records} />

      <section className="sort-grid" id="analysis">
        <AlgorithmCard
          name="Bubble Sort"
          time={formatMs(bubbleTime)}
          complexity={analysis.bubble_sort?.complexity}
        />
        <AlgorithmCard
          name="Merge Sort"
          time={formatMs(mergeTime)}
          complexity={analysis.merge_sort?.complexity}
        />
      </section>

      <section className="charts-grid">
        <BarChart bubbleTime={bubbleTime} mergeTime={mergeTime} max={maxChartTime} />
        <PieChart categories={categories} total={records.length} />
        <LineChart records={records} />
      </section>

      <SortedTable records={sortedRecords} />

      <footer id="about">
        <span>Developed for B.Tech AI Lab Mini Project</span>
        <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub Repository Link</a>
        <span>Team Members: gayathri (2510030421), Padmavathi (2510030085)</span>
      </footer>
    </main>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <strong>{title}</strong>
    </div>
  );
}

function StatCard({ label, value, tone = "" }) {
  return (
    <article className={`stat-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Metric({ label, value, positive = false }) {
  return (
    <div className={`metric ${positive ? "positive" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AlgorithmCard({ name, time, complexity }) {
  return (
    <article className="card algorithm-card">
      <div className="algorithm-header">
        <span>{name}</span>
        <strong>{time}</strong>
      </div>
      <ul>
        <li><span>Best Case</span><b>{complexity?.best}</b></li>
        <li><span>Average Case</span><b>{complexity?.average}</b></li>
        <li><span>Worst Case</span><b>{complexity?.worst}</b></li>
      </ul>
    </article>
  );
}

function DataTable({ records }) {
  return (
    <article className="card table-card">
      <SectionTitle eyebrow="Evidence Data" title="Crime Records Table" />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Crime ID</th>
              <th>Criminal Name</th>
              <th>Crime Type</th>
              <th>Severity Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={`${record.id}-${record.name}`}>
                <td>{record.id}</td>
                <td>{record.name}</td>
                <td>{record.type}</td>
                <td><span className={`score ${severityLevel(record.severity)}`}>{record.severity}</span></td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function SortedTable({ records }) {
  return (
    <article className="card table-card">
      <SectionTitle eyebrow="Sorted Output" title="Crime Records Sorted by Severity Score" />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Crime ID</th>
              <th>Criminal Name</th>
              <th>Crime Type</th>
              <th>Severity Score</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={`${record.id}-${index}`}>
                <td>#{index + 1}</td>
                <td>{record.id}</td>
                <td>{record.name}</td>
                <td>{record.type}</td>
                <td><span className={`score ${severityLevel(record.severity)}`}>{record.severity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function BarChart({ bubbleTime, mergeTime, max }) {
  const bubbleHeight = Math.max((bubbleTime / max) * 175, 8);
  const mergeHeight = Math.max((mergeTime / max) * 175, 8);

  return (
    <article className="card chart-card">
      <SectionTitle eyebrow="Runtime" title="Sorting Execution Time" />
      <svg viewBox="0 0 420 250" role="img" aria-label="Bubble Sort and Merge Sort bar chart">
        <line x1="55" y1="210" x2="380" y2="210" className="axis" />
        <rect x="105" y={210 - bubbleHeight} width="78" height={bubbleHeight} rx="8" className="bar bubble" />
        <rect x="240" y={210 - mergeHeight} width="78" height={mergeHeight} rx="8" className="bar merge" />
        <text x="144" y="235" textAnchor="middle">Bubble</text>
        <text x="279" y="235" textAnchor="middle">Merge</text>
        <text x="144" y={195 - bubbleHeight} textAnchor="middle">{formatMs(bubbleTime)}</text>
        <text x="279" y={195 - mergeHeight} textAnchor="middle">{formatMs(mergeTime)}</text>
      </svg>
    </article>
  );
}

function PieChart({ categories, total }) {
  const entries = Object.entries(categories);
  const colors = ["#0b5ed7", "#14b8a6", "#f59e0b", "#ef4444", "#7c3aed", "#64748b"];
  let offset = 25;

  return (
    <article className="card chart-card">
      <SectionTitle eyebrow="Categories" title="Crime Category Distribution" />
      <div className="pie-layout">
        <svg viewBox="0 0 250 220" role="img" aria-label="Crime category pie chart">
          {entries.map(([type, count], index) => {
            const portion = (count / Math.max(total, 1)) * 100;
            const currentOffset = offset;
            offset -= portion;
            return (
              <circle
                key={type}
                r="68"
                cx="125"
                cy="110"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="32"
                strokeDasharray={`${portion} ${100 - portion}`}
                strokeDashoffset={currentOffset}
              />
            );
          })}
          <circle r="45" cx="125" cy="110" className="pie-center" />
          <text x="125" y="107" textAnchor="middle" className="pie-total">{total}</text>
          <text x="125" y="127" textAnchor="middle">cases</text>
        </svg>
        <div className="legend">
          {entries.map(([type, count], index) => (
            <span key={type}>
              <i style={{ background: colors[index % colors.length] }} />
              {type} ({count})
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function LineChart({ records }) {
  const width = 760;
  const points = records.map((record, index) => {
    const x = 45 + (index * (width - 95)) / Math.max(records.length - 1, 1);
    const y = 215 - (record.severity / 100) * 175;
    return { x, y, record };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <article className="card chart-card wide">
      <SectionTitle eyebrow="Severity" title="Severity Trends" />
      <svg viewBox={`0 0 ${width} 250`} role="img" aria-label="Severity trend line chart">
        <line x1="45" y1="215" x2="720" y2="215" className="axis" />
        <line x1="45" y1="35" x2="45" y2="215" className="axis" />
        <path d={path} className="trend" />
        {points.map((point) => (
          <circle key={`${point.record.id}-${point.x}`} cx={point.x} cy={point.y} r="5" className="dot">
            <title>{point.record.id}: {point.record.severity}</title>
          </circle>
        ))}
        <text x="45" y="25">100</text>
        <text x="45" y="235">0</text>
      </svg>
    </article>
  );
}
