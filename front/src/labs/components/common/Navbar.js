import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import PlantAnimation from '../../../PlantAnimation.json'
import './Navbar.css';
import { useAuth } from '../../../auth/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);
  const navLinks = [
    { path: '/lab', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/lab/mushroom-management', icon: 'bi-diagram-3', label: 'Mushroom Management' },
    { path: '/lab/lab-inventory', icon: 'bi-box-seam', label: 'Lab Inventory' },
    { path: '/lab/allocations', icon: 'bi-arrow-left-right', label: 'Allocations' }
  ];

  const toggleUserMenu = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/Login');
  };

  return (
    <>
      <aside className={`sidebar${mobileNavOpen ? ' open' : ''}`}>
        {/* Brand Section with Lottie Animation */}
        <div className="brand-section d-flex align-items-center gap-3">
          <div style={{ width: 60, height: 60, minWidth: 60, minHeight: 60 }}>
            <Lottie
              animationData={PlantAnimation}
              loop
              autoplay
              style={{ width: 60, height: 60 }}
            />
          </div>          <Link className="navbar-brand d-block text-decoration-none" to="/lab">
            <span className="main-brand d-block">Fungi Flow</span>
            <span className="sub-brand">Lab Management</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="nav-links flex-grow-1" aria-label="Main navigation">
          <ul className="list-unstyled mb-0">
            {navLinks.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link-custom${location.pathname === item.path ? ' active' : ''}`}
                  to={item.path}
                  tabIndex={0}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Dropdown */}
        <footer className="sidebar-footer">
          <div className="user-profile-menu" ref={dropdownRef}>
            <div
              className="user-menu-toggle d-flex align-items-center"
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={toggleUserMenu}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') toggleUserMenu();
                if (e.key === 'Escape') setDropdownOpen(false);
              }}
            >
              <div className="user-avatar" aria-label="User avatar">
                <i className="bi bi-person-fill text-success"></i>
              </div>
              <div className="ms-2 d-none d-md-block text-start">
                <span className="user-name d-block fw-medium">Lab Technician</span>
                <span className="user-role d-block sub-brand">Staff</span>
              </div>
              <i className={`bi bi-chevron-down ms-2${dropdownOpen ? ' rotate-180' : ''}`}></i>
            </div>
            {dropdownOpen && (
              <div className="user-dropdown dropdown-menu-custom shadow-lg border-0 py-2 show">
                <div className="user-header user-header-info text-center py-2 border-bottom">
                  <h6 className="mb-0">Lab Technician</h6>
                  <small>john.doe@fungiflow.com</small>
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
                  onClick={handleLogout} 
                  className="user-menu-item text-danger w-100 text-start border-0 bg-transparent"
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                </button>
              </div>
            )}
          </div>
        </footer>
      </aside>

      {/* Spacer for main content so it doesn't go under sidebar */}
      <div className="sidebar-spacer"></div>

      {/* Mobile Hamburger Toggle */}
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
};

export default Navbar;
