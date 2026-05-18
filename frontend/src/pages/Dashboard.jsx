import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, avgScore: 0, topDept: '-', highPerformers: 0 });
  const [topEmployees, setTopEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/employees');
        const employees = data.data;
        const total = employees.length;
        const avgScore = total ? Math.round(employees.reduce((s, e) => s + e.performanceScore, 0) / total) : 0;
        const highPerformers = employees.filter(e => e.performanceScore >= 80).length;

        // Count department occurrences
        const deptCount = {};
        employees.forEach(e => { deptCount[e.department] = (deptCount[e.department] || 0) + 1; });
        const topDept = Object.keys(deptCount).sort((a, b) => deptCount[b] - deptCount[a])[0] || '-';

        setStats({ total, avgScore, topDept, highPerformers });
        setTopEmployees(employees.slice(0, 5));
      } catch (_) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRankColor = (score) => {
    if (score >= 80) return 'badge-green';
    if (score >= 60) return 'badge-yellow';
    return 'badge-red';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Welcome back, <span>{user?.name}</span> 👋</h1>
        <p className="page-subtitle">Here's your employee analytics overview</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{loading ? '—' : stats.total}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '—' : `${stats.avgScore}%`}</div>
          <div className="stat-label">Avg Performance Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '—' : stats.highPerformers}</div>
          <div className="stat-label">High Performers (≥80)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{loading ? '—' : stats.topDept}</div>
          <div className="stat-label">Largest Department</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>QUICK ACTIONS</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/add-employee" className="btn btn-primary">➕ Add Employee</Link>
          <Link to="/employees" className="btn btn-secondary">📋 View All Employees</Link>
          <Link to="/ai" className="btn btn-secondary">🤖 AI Recommendations</Link>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-secondary)' }}>
          🏆 TOP PERFORMERS
        </h2>
        {loading ? (
          <div className="spinner" />
        ) : topEmployees.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <h3>No employees yet</h3>
            <p><Link to="/add-employee" style={{ color: 'var(--accent)' }}>Add your first employee</Link></p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topEmployees.map((emp, i) => (
              <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{emp.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{emp.department}</div>
                </div>
                <span className={`badge ${getRankColor(emp.performanceScore)}`}>
                  {emp.performanceScore}/100
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
