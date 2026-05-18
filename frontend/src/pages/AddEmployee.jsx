import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'];

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', department: 'Development',
    skills: [], performanceScore: '', experience: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (formData.skills.includes(s)) { toast.error('Skill already added'); return; }
    setFormData({ ...formData, skills: [...formData.skills, s] });
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    if (formData.skills.length === 0) e.skills = 'Add at least one skill';
    if (!formData.performanceScore) e.performanceScore = 'Required';
    else if (formData.performanceScore < 0 || formData.performanceScore > 100) e.performanceScore = 'Must be 0-100';
    if (!formData.experience && formData.experience !== 0) e.experience = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await API.post('/employees', {
        ...formData,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
      });
      toast.success('Employee added successfully! 🎉');
      navigate('/employees');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add employee';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Add <span>New Employee</span></h1>
        <p className="page-subtitle">Register a new employee into the system</p>
      </div>

      <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Employee Name *</label>
              <input id="emp-name" className="form-input" type="text" name="name"
                placeholder="Aman Verma" value={formData.name} onChange={handleChange} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input id="emp-email" className="form-input" type="email" name="email"
                placeholder="aman@gmail.com" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select id="emp-department" className="form-select" name="department"
                value={formData.department} onChange={handleChange}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Performance Score */}
            <div className="form-group">
              <label className="form-label">Performance Score * (0-100)</label>
              <input id="emp-score" className="form-input" type="number" name="performanceScore"
                placeholder="85" min="0" max="100" value={formData.performanceScore} onChange={handleChange} />
              {errors.performanceScore && <span className="form-error">{errors.performanceScore}</span>}
            </div>

            {/* Experience */}
            <div className="form-group">
              <label className="form-label">Years of Experience *</label>
              <input id="emp-experience" className="form-input" type="number" name="experience"
                placeholder="3" min="0" value={formData.experience} onChange={handleChange} />
              {errors.experience && <span className="form-error">{errors.experience}</span>}
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label">Skills *</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input id="emp-skill-input" className="form-input" type="text"
                placeholder="e.g. React, Node.js" value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
              />
              <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
            </div>
            {errors.skills && <span className="form-error">{errors.skills}</span>}
            {formData.skills.length > 0 && (
              <div className="emp-skills" style={{ marginTop: 10 }}>
                {formData.skills.map(s => (
                  <span key={s} className="badge badge-blue" style={{ cursor: 'pointer', gap: 6 }}
                    onClick={() => removeSkill(s)}>
                    {s} <span style={{ opacity: 0.6 }}>✕</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>
              Cancel
            </button>
            <button id="emp-submit" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : '✅ Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
