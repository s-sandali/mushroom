import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import {
  FaUser,
  FaLock,
  FaSeedling,
  FaFlask,
  FaChartLine,
  FaBoxOpen,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import mushroomGrowth from '../PlantAnimation.json';
import { ROLES } from './roles';
import { API_BASE_URL } from '../config/apiConfig';

const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Administrator', description: 'Full system access', icon: FaChartLine },
  { value: ROLES.LAB, label: 'Lab Specialist', description: 'Cultures & batches', icon: FaFlask },
  { value: ROLES.INVENTORY, label: 'Inventory Manager', description: 'Materials & stock', icon: FaBoxOpen },
  { value: ROLES.SALES, label: 'Sales Manager', description: 'Orders & branches', icon: FaSeedling }
];

const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/auth/signup`;

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!username.trim() || !password || !confirmPassword || !role) {
      setError('Username, password, confirmation, and role are required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await fetch(SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), password, role })
      });

      if (response.ok) {
        navigate('/Login');
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
          <p className="lead">Secure workspace provisioning for labs, inventory, and sales teams.</p>
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
          <h2 className="fw-bold text-success mb-2">Create your account</h2>
          <p className="text-muted mb-4">Invite your MTDC role and align with the same secure experience as login.</p>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSignup}>
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
              <label htmlFor="signup-username" className="form-label fw-semibold">Username</label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  id="signup-username"
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="signup-password" className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
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
            <div className="mb-4">
              <label htmlFor="signup-confirm" className="form-label fw-semibold">Confirm password</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  id="signup-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-muted">Already have access? </span>
            <Link to="/Login" className="fw-semibold">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
