import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const DEPARTMENTS = ['All', 'Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'];

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ department: '', name: '', skill: '', minScore: '', maxScore: '' });
  const [editEmp, setEditEmp] = useState(null);
  const [editScore, setEditScore] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.department && filters.department !== 'All') params.department = filters.department;
      if (filters.name) params.name = filters.name;
      if (filters.skill) params.skill = filters.skill;
      if (filters.minScore) params.minScore = filters.minScore;
      if (filters.maxScore) params.maxScore = filters.maxScore;

      const hasFilter = Object.keys(params).length > 0;
      const url = hasFilter ? '/employees/search' : '/employees';
      const { data } = await API.get(url, { params });
      setEmployees(data.data);
    } catch {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []); // eslint-disable-line

  const handleSearch = (e) => { e.preventDefault(); fetchEmployees(); };

  const handleReset = () => {
    setFilters({ department: '', name: '', skill: '', minScore: '', maxScore: '' });
    setTimeout(() => fetchEmployees(), 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    setDeleting(id);
    try {
      await API.delete(`/employees/${id}`);
      toast.success('Employee removed successfully');
      setEmployees(prev => prev.filter(e => e._id !== id));
    } catch {
      toast.error('Failed to delete employee');
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateScore = async () => {
    try {
      const { data } = await API.put(`/employees/${editEmp._id}`, { performanceScore: Number(editScore) });
      toast.success('Performance score updated!');
      setEmployees(prev => prev.map(e => e._id === editEmp._id ? data.data : e));
      setEditEmp(null);
    } catch {
      toast.error('Update failed');
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'badge-green';
    if (score >= 60) return 'badge-yellow';
    return 'badge-red';
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Employee <span>Directory</span></h1>
          <p className="page-subtitle">{employees.length} employees found</p>
        </div>
        <Link to="/add-employee" className="btn btn-primary">➕ Add Employee</Link>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch}>
        <div className="search-bar">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input id="filter-name" className="form-input" type="text" placeholder="Search name…"
              value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select id="filter-dept" className="form-select"
              value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })}>
              {DEPARTMENTS.map(d => <option key={d} value={d === 'All' ? '' : d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skill</label>
            <input id="filter-skill" className="form-input" type="text" placeholder="e.g. React"
              value={filters.skill} onChange={e => setFilters({ ...filters, skill: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Min Score</label>
            <input id="filter-min" className="form-input" type="number" placeholder="0"
              value={filters.minScore} onChange={e => setFilters({ ...filters, minScore: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Score</label>
            <input id="filter-max" className="form-input" type="number" placeholder="100"
              value={filters.maxScore} onChange={e => setFilters({ ...filters, maxScore: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
            <button id="search-btn" type="submit" className="btn btn-primary btn-sm">Search</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </form>

      {/* Employee Grid */}
      {loading ? (
        <div className="loading-wrap"><div className="spinner" /><p>Loading employees…</p></div>
      ) : employees.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>No employees found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="emp-grid">
          {employees.map(emp => (
            <div key={emp._id} className="card emp-card">
              <div className="emp-name">{emp.name}</div>
              <div className="emp-email">✉️ {emp.email}</div>

              <div className="emp-meta">
                <span className="badge badge-blue">🏢 {emp.department}</span>
                <span className={`badge ${getScoreBadge(emp.performanceScore)}`}>
                  ⭐ {emp.performanceScore}/100
                </span>
                <span className="badge badge-yellow">📅 {emp.experience} yrs</span>
              </div>

              {/* Score bar */}
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${emp.performanceScore}%` }} />
              </div>

              {/* Skills */}
              <div className="emp-skills" style={{ marginTop: 12 }}>
                {emp.skills.map(s => (
                  <span key={s} className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{s}</span>
                ))}
              </div>

              <div className="emp-actions">
                <Link to={`/ai?employeeId=${emp._id}`} className="btn btn-success btn-sm">🤖 AI</Link>
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditEmp(emp); setEditScore(emp.performanceScore); }}>
                  ✏️ Score
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp._id)} disabled={deleting === emp._id}>
                  {deleting === emp._id ? '…' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Score Modal */}
      {editEmp && (
        <div className="modal-overlay" onClick={() => setEditEmp(null)}>
          <div className="card glass modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Update Score — {editEmp.name}</span>
              <button className="modal-close" onClick={() => setEditEmp(null)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">New Performance Score (0-100)</label>
              <input id="edit-score" className="form-input" type="number" min="0" max="100"
                value={editScore} onChange={e => setEditScore(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setEditEmp(null)}>Cancel</button>
              <button id="save-score" className="btn btn-primary" onClick={handleUpdateScore}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
