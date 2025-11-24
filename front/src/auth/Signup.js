import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { FaUser, FaLock, FaSeedling, FaFlask, FaChartLine, FaBoxOpen } from 'react-icons/fa';
import mushroomGrowth from '../PlantAnimation.json';
import { ROLES } from './roles';

const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Admin', icon: <FaChartLine className="me-2" /> },
  { value: ROLES.LAB, label: 'Lab', icon: <FaFlask className="me-2" /> },
  { value: ROLES.INVENTORY, label: 'Inventory', icon: <FaBoxOpen className="me-2" /> },
  { value: ROLES.SALES, label: 'Sales', icon: <FaSeedling className="me-2" /> }
];

const QUICK_ACTIONS = [
  { title: 'Cultures', description: 'Monitor growing batches', icon: <FaFlask className="text-success" /> },
  { title: 'Inventory', description: 'Track raw materials', icon: <FaBoxOpen className="text-warning" /> },
  { title: 'Analytics', description: 'See sales trends', icon: <FaChartLine className="text-info" /> },
  { title: 'Distribution', description: 'Coordinate deliveries', icon: <FaSeedling className="text-success" /> }
];

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(ROLES.INVENTORY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!username.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
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
      const response = await fetch('http://localhost:8080/api/auth/signup', {
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
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="row g-4 align-items-center mb-4">
          <div className="col-lg-6">
            <h1 className="fw-bold text-success">Create your FungiFlow account</h1>
            <p className="text-muted">Centralized access for labs, inventory, and sales teams across MTDC.</p>
            <div className="row g-3 mt-3">
              {QUICK_ACTIONS.map(({ title, description, icon }) => (
                <div className="col-sm-6" key={title}>
                  <div className="card border-0 shadow-sm p-3 h-100">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                        {icon}
                      </div>
                      <h6 className="mb-0">{title}</h6>
                    </div>
                    <small className="text-muted">{description}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <Lottie animationData={mushroomGrowth} style={{ height: 220 }} />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center text-success mb-3">Sign up</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleSignup}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="signup-username">Username</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUser /></span>
                      <input
                        id="signup-username"
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="signup-password">Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input
                          id="signup-password"
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="signup-confirm">Confirm password</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input
                          id="signup-confirm"
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="form-label fw-semibold">Choose a role</label>
                    <div className="row g-2">
                      {ROLE_OPTIONS.map((option) => (
                        <div className="col-6" key={option.value}>
                          <button
                            type="button"
                            className={`btn w-100 ${role === option.value ? 'btn-success text-white' : 'btn-outline-success'}`}
                            onClick={() => setRole(option.value)}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100 mt-4"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating account…' : 'Create account'}
                  </button>
                </form>
                <div className="text-center mt-3">
                  <small className="text-muted">Already registered? </small>
                  <Link to="/Login" className="fw-semibold">Sign in</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;