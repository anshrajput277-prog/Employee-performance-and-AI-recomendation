import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AIRecommendation = () => {
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rankResult, setRankResult] = useState(null);
  const [rankLoading, setRankLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('single');

  // Load employees for dropdown
  useEffect(() => {
    API.get('/employees').then(({ data }) => {
      setEmployees(data.data);
      const preId = searchParams.get('employeeId');
      if (preId) { setSelectedId(preId); }
    }).catch(() => {});
  }, [searchParams]);

  const handleRecommend = async () => {
    if (!selectedId) { toast.error('Please select an employee'); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await API.post('/ai/recommend', { employeeId: selectedId });
      setResult(data);
      toast.success('AI recommendation ready! 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRankAll = async () => {
    setRankLoading(true);
    setRankResult(null);
    try {
      const { data } = await API.post('/ai/rank-all');
      setRankResult(data);
      toast.success('Team ranking generated! 🏆');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI ranking failed');
    } finally {
      setRankLoading(false);
    }
  };

  const getRankingBadge = (ranking) => {
    if (!ranking) return 'badge-blue';
    const r = ranking.toLowerCase();
    if (r.includes('excellent')) return 'badge-green';
    if (r.includes('good')) return 'badge-blue';
    if (r.includes('average')) return 'badge-yellow';
    return 'badge-red';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🤖 AI <span>Recommendations</span></h1>
        <p className="page-subtitle">Powered by OpenRouter AI — Promotion, Training & Feedback Analysis</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'single' ? 'active' : ''}`} onClick={() => setActiveTab('single')}>
          Single Employee
        </button>
        <button className={`tab ${activeTab === 'rank' ? 'active' : ''}`} onClick={() => setActiveTab('rank')}>
          Rank All Employees
        </button>
      </div>

      {/* ── Single Recommendation ── */}
      {activeTab === 'single' && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16 }}>
              SELECT EMPLOYEE
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1, minWidth: 240, marginBottom: 0 }}>
                <label className="form-label">Employee</label>
                <select id="ai-employee-select" className="form-select"
                  value={selectedId} onChange={e => { setSelectedId(e.target.value); setResult(null); }}>
                  <option value="">-- Choose an employee --</option>
                  {employees.map(e => (
                    <option key={e._id} value={e._id}>
                      {e.name} ({e.department} — {e.performanceScore}/100)
                    </option>
                  ))}
                </select>
              </div>
              <button id="ai-recommend-btn" className="btn btn-primary" onClick={handleRecommend} disabled={loading}>
                {loading ? '⏳ Analyzing…' : '🤖 Get AI Recommendation'}
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="loading-wrap">
              <div className="spinner" />
              <p>AI is analyzing employee data…</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <>
              {/* Employee Info Banner */}
              <div className="card" style={{ background: 'var(--gradient-card)', marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{result.employee?.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {result.employee?.department} · Score: {result.employee?.performanceScore}/100 · {result.employee?.experience} yrs exp
                  </div>
                </div>
                <span className={`badge ${getRankingBadge(result.recommendation?.performanceRanking)}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                  {result.recommendation?.performanceRanking || 'N/A'}
                </span>
              </div>

              <div className="ai-result">
                {/* Promotion */}
                <div className="ai-block">
                  <h3>🚀 Promotion Recommendation</h3>
                  <div className={result.recommendation?.promotionRecommendation?.eligible ? 'ai-promotion-yes' : 'ai-promotion-no'}>
                    {result.recommendation?.promotionRecommendation?.eligible ? '✅ Eligible' : '❌ Not Eligible'}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 10, lineHeight: 1.6 }}>
                    {result.recommendation?.promotionRecommendation?.reason}
                  </p>
                </div>

                {/* Ranking */}
                <div className="ai-block">
                  <h3>📊 Performance Ranking</h3>
                  <span className={`badge ${getRankingBadge(result.recommendation?.performanceRanking)}`} style={{ fontSize: '1rem', padding: '8px 18px' }}>
                    {result.recommendation?.performanceRanking || '—'}
                  </span>
                </div>

                {/* Training */}
                <div className="ai-block">
                  <h3>📚 Training Suggestions</h3>
                  {result.recommendation?.trainingSuggestions ? (
                    <ul className="ai-list">
                      {result.recommendation.trainingSuggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : <p style={{ color: 'var(--text-muted)' }}>—</p>}
                </div>

                {/* Feedback */}
                <div className="ai-block ai-full">
                  <h3>💬 AI Feedback</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {result.recommendation?.aiFeedback || result.recommendation?.rawResponse || '—'}
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Rank All ── */}
      {activeTab === 'rank' && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.9rem' }}>
              Analyze all employees at once and get AI-powered team insights, promotion candidates, and improvement areas.
            </p>
            <button id="ai-rank-btn" className="btn btn-primary" onClick={handleRankAll} disabled={rankLoading}>
              {rankLoading ? '⏳ Ranking team…' : '🏆 Rank All Employees'}
            </button>
          </div>

          {rankLoading && (
            <div className="loading-wrap">
              <div className="spinner" />
              <p>AI is analyzing your entire team…</p>
            </div>
          )}

          {rankResult && !rankLoading && (
            <>
              {/* AI Analysis */}
              <div className="ai-result" style={{ marginBottom: 24 }}>
                <div className="ai-block">
                  <h3>🌟 Top Performer</h3>
                  <div className="value">{rankResult.aiAnalysis?.topPerformer?.name || '—'}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
                    {rankResult.aiAnalysis?.topPerformer?.reason}
                  </p>
                </div>
                <div className="ai-block">
                  <h3>📈 Promotion Candidates</h3>
                  <ul className="ai-list">
                    {(rankResult.aiAnalysis?.promotionCandidates || []).map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
                <div className="ai-block">
                  <h3>⚠️ Needs Improvement</h3>
                  <ul className="ai-list">
                    {(rankResult.aiAnalysis?.needsImprovement || []).map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
                <div className="ai-block ai-full">
                  <h3>💡 Overall Team Insight</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {rankResult.aiAnalysis?.overallInsight || rankResult.aiAnalysis?.rawResponse || '—'}
                  </p>
                </div>
              </div>

              {/* Ranked Table */}
              <div className="card">
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  📋 EMPLOYEE RANKINGS
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px' }}>Rank</th>
                        <th style={{ padding: '10px 12px' }}>Name</th>
                        <th style={{ padding: '10px 12px' }}>Department</th>
                        <th style={{ padding: '10px 12px' }}>Score</th>
                        <th style={{ padding: '10px 12px' }}>Experience</th>
                        <th style={{ padding: '10px 12px' }}>Skills</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankResult.rankedEmployees?.map(emp => (
                        <tr key={emp.rank} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: emp.rank <= 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
                            {emp.rank <= 3 ? ['🥇','🥈','🥉'][emp.rank-1] : `#${emp.rank}`}
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600 }}>{emp.name}</td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{emp.department}</td>
                          <td style={{ padding: '12px' }}>
                            <span className={`badge ${getRankingBadge(emp.performanceScore >= 80 ? 'excellent' : emp.performanceScore >= 60 ? 'good' : 'below')}`}>
                              {emp.performanceScore}/100
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{emp.experience} yrs</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {emp.skills?.slice(0, 3).map(s => (
                                <span key={s} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{s}</span>
                              ))}
                              {emp.skills?.length > 3 && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>+{emp.skills.length - 3}</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AIRecommendation;
