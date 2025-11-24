import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSeedling,
  FaFlask,
  FaChartLine,
  FaBoxOpen
} from 'react-icons/fa';
import mushroomGrowth from '../PlantAnimation.json';
import { useAuth } from './AuthContext';
import { ROLES, roleToHome } from './roles';

const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Administrator', description: 'Full system access', icon: FaChartLine },
  { value: ROLES.LAB, label: 'Lab Specialist', description: 'Cultures & batches', icon: FaFlask },
  { value: ROLES.INVENTORY, label: 'Inventory Manager', description: 'Materials & stock', icon: FaBoxOpen },
  { value: ROLES.SALES, label: 'Sales Manager', description: 'Orders & branches', icon: FaSeedling }
];

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password || !role) {
      setError('Username, password, and role are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const user = await login({ username, password, role });
      navigate(roleToHome(user.role));
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row bg-light">
      <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-5 bg-success" style={{ minHeight: '40vh' }}>
        <div className="text-center" style={{ maxWidth: 420 }}>
          <Lottie animationData={mushroomGrowth} style={{ height: 180 }} />
          <h1 className="fw-bold mt-3">FungiFlow</h1>
          <p className="lead">Smart mushroom production for labs, inventory, and sales teams.</p>
          <div className="d-flex justify-content-center gap-4 mt-4">
            <div>
              <div className="fw-bold fs-4">4</div>
              <small>Regional Labs</small>
            </div>
            <div>
              <div className="fw-bold fs-4">5</div>
              <small>Mushroom Types</small>
            </div>
            <div>
              <div className="fw-bold fs-4">24/7</div>
              <small>Monitoring</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-lg-5 bg-white">
        <div className="w-100" style={{ maxWidth: 480 }}>
          <h2 className="fw-bold text-success mb-2">Welcome back</h2>
          <p className="text-muted mb-4">Sign in with your MTDC credentials to continue.</p>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold">Select your role</label>
              <div className="row g-2">
                {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                  <div className="col-6" key={value}>
                    <button
                      type="button"
                      className={`btn w-100 text-start shadow-sm ${role === value ? 'btn-success text-white' : 'btn-outline-success'}`}
                      onClick={() => setRole(value)}
                    >
                      <div className="d-flex align-items-center">
                        <Icon className="me-2" />
                        <div>
                          <div className="fw-semibold small">{label}</div>
                          <small className="text-muted d-block">{description}</small>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">Username</label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-muted">Need an account? </span>
            <Link to="/Signup" className="fw-semibold">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;