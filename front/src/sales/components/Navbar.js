import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Lottie from 'lottie-react';
import PlantAnimation from '../PlantAnimation.json';
import { useAuth } from '../../auth/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const profileRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setProfileOpen(false);
  }, [location]);
  const navLinks = [
    { to: '/sales/management', label: 'Sales List', icon: 'bi-cash-stack' },
    { to: '/sales/preorders', label: 'Pre Orders', icon: 'bi-calendar-check' },
    { to: '/sales/allocations', label: 'Allocations', icon: 'bi-diagram-3' },
    { to: '/sales/branches', label: 'Branches', icon: 'bi-geo-alt' },
    { to: '/sales/inventory', label: 'Inventory', icon: 'bi-box-seam' }
  ];

  return (
    <>
      <aside className={`sidebar${mobileNavOpen ? ' open' : ''}`}>
        {/* Brand Section */}
        <div
          className="brand-section d-flex align-items-center gap-3 mb-2"
          style={{ minHeight: 64, padding: '1.25rem 1.5rem 1rem 1.5rem' }}
        >
          <Lottie
            animationData={PlantAnimation}
            loop
            autoplay
            style={{ width: 38, height: 38, minWidth: 38, minHeight: 38 }}
          />
          <div>
            <Link
              to="/"
              className="navbar-brand main-brand mb-0"
              style={{
                display: 'block',
                padding: 0,
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.7px',
                lineHeight: 1.1,
                marginBottom: 0
              }}
            >
              Fungi Flow
            </Link>
            <div
              className="sub-brand"
              style={{
                fontSize: '0.96rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.82)',
                letterSpacing: '0.3px',
                marginTop: 2
              }}
            >
              Sales Manager
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link-custom d-flex align-items-center${location.pathname === to ? ' active' : ''}`}
            >
              <i className={`bi ${icon}`}></i> {label}
            </Link>
          ))}
        </div>

        {/* User Profile Dropdown (unchanged) */}
        <footer className="sidebar-footer">
          <div className="user-profile-menu" ref={profileRef}>
            <div
              className="user-menu-toggle d-flex align-items-center"
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen(open => !open)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setProfileOpen(open => !open);
                if (e.key === 'Escape') setProfileOpen(false);
              }}
            >
              <div className="user-avatar" aria-label="User avatar">
                <i className="bi bi-person-fill text-success"></i>
              </div>
              <div className="ms-2 d-none d-md-block text-start">
                <span className="user-name d-block fw-medium">Sales Manager</span>
                <span className="user-role d-block sub-brand">Staff</span>
              </div>
              <i className={`bi bi-chevron-down ms-2${profileOpen ? ' rotate-180' : ''}`}></i>
            </div>
            {profileOpen && (
              <div className="user-dropdown dropdown-menu-custom shadow-lg border-0 py-2 show">
                <div className="user-header user-header-info text-center py-2 border-bottom">
                  <h6 className="mb-0">Sales Manager</h6>
                  <small>sales@fungiflow.com</small>
                </div>
                <Link to="/profile" className="user-menu-item" tabIndex={0}>
                  <i className="bi bi-person me-2"></i> My Profile
                </Link>
                <Link to="/settings" className="user-menu-item" tabIndex={0}>
                  <i className="bi bi-gear me-2"></i> Settings
                </Link>
                <Link to="/help" className="user-menu-item" tabIndex={0}>
                  <i className="bi bi-question-circle me-2"></i> Help Center
                </Link>
                <div className="divider"></div>
                <button
                  className="user-menu-item text-danger w-100 text-start border-0 bg-transparent"
                  onClick={async () => {
                    await logout();
                    navigate('/Login');
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                </button>
              </div>
            )}
          </div>
        </footer>
      </aside>
      <div className="sidebar-spacer"></div>
      <button
        className={`navbar-toggler border-0 d-lg-none${mobileNavOpen ? ' open' : ''}`}
        type="button"
        onClick={() => setMobileNavOpen(open => !open)}
        aria-controls="sidebar"
        aria-expanded={mobileNavOpen}
        aria-label="Toggle navigation"
        style={{
          position: 'fixed',
          top: 18,
          left: 18,
          zIndex: 1100,
          background: 'rgba(27,156,133,0.9)',
          borderRadius: '50%',
          width: 44,
          height: 44,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
        }}
      >
        <div className="hamburger-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </>
  );
}
