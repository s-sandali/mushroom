import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Lottie from 'lottie-react';
import PlantAnimation from '../../PlantAnimation.json';
import './Navbar.css';
import { useAuth } from '../../auth/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMaterialPage = location.pathname === "/admin/materials";
  const isEmployeePage = location.pathname === "/admin/employees";
  const isDashboardPage = location.pathname === "/admin/dashboard" || location.pathname === "/admin";
  const isSalesReportPage = location.pathname === "/admin/analytics/sales";

  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useAuth();

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/Login');
  };

  return (
    <>
      <div className="sidebar fixed-left d-flex flex-column">
        {/* Brand Section with Plant Animation */}
        <div className="brand-section p-3 d-flex align-items-center gap-3" style={{ minHeight: 64 }}>
          <Lottie
            animationData={PlantAnimation}
            loop
            autoplay
            style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}
          />
          <Link to="/admin" className="navbar-brand d-block text-decoration-none" style={{ lineHeight: 1 }}>
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
            }}>Admin and Management</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links flex-grow-1 p-3">
          <ul className="nav flex-column">            <li className="nav-item mb-2">
              <Link 
                className={`nav-link py-2 px-3 nav-link-custom d-flex align-items-center${isDashboardPage ? ' active' : ''}`} 
                to="/admin/dashboard"
              >
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link 
                className={`nav-link py-2 px-3 nav-link-custom d-flex align-items-center${isMaterialPage ? ' active' : ''}`} 
                to="/admin/materials"
              >
                <i className="bi bi-basket me-2"></i> Materials
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link 
                className={`nav-link py-2 px-3 nav-link-custom d-flex align-items-center${isEmployeePage ? ' active' : ''}`} 
                to="/admin/employees"
              >
                <i className="bi bi-people me-2"></i> Employees
              </Link>
            </li>

            <Dropdown as="li" className="nav-item mb-2">
              <Dropdown.Toggle
                as="a"
                className={`nav-link py-2 px-3 nav-link-custom d-flex align-items-center${isSalesReportPage ? ' active' : ''}`}
              >
                <i className="bi bi-bar-chart me-2"></i> Analytics
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-custom">
                <Dropdown.Item as={Link} to="/admin/analytics/sales" className="dropdown-item-custom">
                  <i className="bi bi-graph-up me-2"></i> Sales Reports
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/analytics/labs" className="dropdown-item-custom">
                  <i className="bi bi-flask me-2"></i> Lab Reports
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </div>

        {/* Footer: Add Material only (not Add Employee), Time, User Profile */}
        <div className="sidebar-footer p-3">
          <div className="user-profile-menu position-relative">
            <button onClick={toggleUserMenu} className="user-menu-toggle w-100 p-2">
              <div className="user-avatar">
                <span>AD</span>
              </div>
            </button>
            {showUserMenu && (
              <div className="user-dropdown shadow-lg">
                <div className="user-header p-3">
                  <div className="user-header-info">
                    <h6 className="mb-0">Admin User</h6>
                    <small className="text-muted">System Administrator</small>
                  </div>
                </div>
                <Link to="/profile" className="user-menu-item">
                  <i className="bi bi-person me-2"></i> My Profile
                </Link>
                <Link to="/settings" className="user-menu-item">
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
      </div>
      <div className="sidebar-spacer"></div>
    </>
  );
}
