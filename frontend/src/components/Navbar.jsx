import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">⚡ EmpAI</NavLink>

        {isLoggedIn && (
          <div className="navbar-links">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Employees
            </NavLink>
            <NavLink to="/add-employee" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              + Add
            </NavLink>
            <NavLink to="/ai" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              🤖 AI
            </NavLink>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0 8px' }}>
              {user?.name}
            </span>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
