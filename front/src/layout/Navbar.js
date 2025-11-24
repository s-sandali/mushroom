import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Lottie from 'lottie-react';
import PlantAnimation from '../PlantAnimation.json';
import './Navbar.css';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const profileRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useAuth();

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile nav and dropdowns on route change
  useEffect(() => {
    setMobileNavOpen(false);
    setAnalyticsOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/Login');
  };
  const navLinks = [
    { to: '/inventory', label: 'Home', icon: 'bi-house' },
    { to: '/inventory/supplier', label: 'Suppliers', icon: 'bi-people' },
    { to: '/inventory/management', label: 'Inventory', icon: 'bi-box-seam' },
    { to: '/inventory/raw', label: 'Material', icon: 'bi-basket' },
  ];

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      <aside className={`sidebar${mobileNavOpen ? ' open' : ''}`}>
        {/* Brand Section with Plant Animation */}
        <div className="brand-section p-3 d-flex align-items-center gap-3" style={{ minHeight: 64 }}>
          <Lottie
            animationData={PlantAnimation}
            loop
            autoplay
            style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}
          />
          <Link to="/inventory" className="navbar-brand d-block text-decoration-none" style={{ lineHeight: 1 }}>
            <span className="main-brand d-block" style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.7px'
            }}>Fungi Flow</span>
            <span className="sub-brand" style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 500,
              letterSpacing: '0.3px'
            }}>Inventory Management</span>
          </Link>
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

          {/* Analytics Dropdown */}
          <Dropdown 
            show={analyticsOpen}
            onToggle={(isOpen) => setAnalyticsOpen(isOpen)}
            className="nav-item"
          >
            <Dropdown.Toggle
              as="a"
              className="nav-link-custom d-flex align-items-center w-100"
              style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 500, fontSize: '1rem' }}
            >
              <i className="bi bi-graph-up me-2"></i>
              Analytics
            </Dropdown.Toggle>            <Dropdown.Menu className="dropdown-menu-custom">
              <Dropdown.Item 
                as={Link} 
                to="/inventory/raw" 
                className="dropdown-item-custom"
                onClick={() => setAnalyticsOpen(false)}
              >
                <i className="bi bi-bag me-2"></i> Purchased Raws
              </Dropdown.Item>
              <Dropdown.Item 
                as={Link} 
                to="/inventory/management" 
                className="dropdown-item-custom"
                onClick={() => setAnalyticsOpen(false)}
              >
                <i className="bi bi-box me-2"></i> All Inventory
              </Dropdown.Item>
              <Dropdown.Item 
                as={Link} 
                to="/inventory/management/lab" 
                className="dropdown-item-custom"
                onClick={() => setAnalyticsOpen(false)}
              >
                <i className="bi bi-flask me-2"></i> Lab Inventory
              </Dropdown.Item>
              <Dropdown.Item 
                as={Link} 
                to="/inventory/management/sales" 
                className="dropdown-item-custom"
                onClick={() => setAnalyticsOpen(false)}
              >
                <i className="bi bi-cart me-2"></i> Sales Inventory
              </Dropdown.Item>
              <Dropdown.Item 
                as={Link} 
                to="/inventory/management/other" 
                className="dropdown-item-custom"
                onClick={() => setAnalyticsOpen(false)}
              >
                <i className="bi bi-archive me-2"></i> Other Inventory
              </Dropdown.Item>
              <Dropdown.Item 
                as={Link} 
                to="/inventory/stock" 
                className="dropdown-item-custom"
                onClick={() => setAnalyticsOpen(false)}
              >
                <i className="bi bi-pie-chart me-2"></i> Stock Analytics
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Footer: User Profile */}
        <div className="sidebar-footer p-3">
          <div className="user-profile-menu position-relative">
            <button onClick={toggleUserMenu} className="user-menu-toggle w-100 p-2">
              <div className="user-avatar">
                <span>IM</span>
              </div>
            </button>
            {showUserMenu && (
              <div className="user-dropdown shadow-lg">
                <div className="user-header p-3">
                  <div className="user-header-info">
                    <h6 className="mb-0">Inventory Manager</h6>
                    <small className="text-muted">System Administrator</small>
                  </div>
                </div>
                <Link to="/inventory/profile" className="user-menu-item">
                  <i className="bi bi-person me-2"></i> My Profile
                </Link>
                <Link to="/inventory/settings" className="user-menu-item">
                  <i className="bi bi-gear me-2"></i> Settings
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
        </div>
      </aside>

      {/* Spacer to prevent content under sidebar */}
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
}
