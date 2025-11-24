import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React from 'react';

// Import Navbars
import InventoryNavbar from './layout/Navbar';
import ReportsNavbar from './reports/Layout/Navbar';
import LabsNavbar from './labs/components/common/Navbar';
import SalesNavbar from './sales/components/Navbar';

// Import Auth components
import Login from './auth/Login';
import Signup from './auth/Signup';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import { ROLES } from './auth/roles';

// Import Inventory components
import Raw from './pages/Raw';
import InventoryManagement from './pages/InventoryManagement';
import Supplier from './pages/Supplier';
import Stock from './pages/Stock';
import Name from './layout/Name';
import Dashboard from './pages/Dashboard';

// Import Reports components
import AdminDashboard from './reports/AdminDashboard/Dashboard';
import EmployeeManagement from './reports/Employees/EmployeeManagement';
import SalesReport from './reports/Reports/SalesReport';
import LabReports from './reports/Reports/LabReports';
import MaterialManagement from './reports/Materials/MaterialManagement';

// Import Lab components
import LabDashboard from './labs/pages/Dashboard';
import MushroomManagement from './labs/pages/MushroomManagement';
import LabInventory from './labs/pages/LabInventory';
import AllocationManagement from './labs/pages/AllocationManagement';

// Import Sales components
import SalesManagement from './sales/components/SalesManagement';
import PreorderManagement from './sales/components/PreorderManagement';
import Inventory from './sales/components/Inventory';
import AllocationComponent from './sales/components/AllocationComponent';
import BranchComponent from './sales/components/BranchComponent';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/Login' || location.pathname === '/Signup';
  const isLoadingPage = location.pathname === '/';
  const { user } = useAuth();
  const userRole = user?.role;

  let NavbarComponent = null;
  if (!isAuthPage && !isLoadingPage) {
    switch(userRole) {
      case ROLES.LAB:
        NavbarComponent = <LabsNavbar />;
        break;
      case ROLES.ADMIN:
        NavbarComponent = <ReportsNavbar />;
        break;
      case ROLES.INVENTORY:
        NavbarComponent = <InventoryNavbar />;
        break;
      case ROLES.SALES:
        NavbarComponent = <SalesNavbar />;
        break;
      default:
        NavbarComponent = null;
    }
  }

  // For auth pages and loading page, render children without sidebar layout
  if (isAuthPage || isLoadingPage) {
    return children;
  }

  // For authenticated pages, render with sidebar layout
  return (
    <div className="d-flex">
      {NavbarComponent}
      <main className="main-content flex-grow-1">
        <div className="container-fluid">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            
            {/* Root route - Always show loading screen first */}
            <Route path="/" element={<Name />} />

            {/* Lab Staff Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.LAB, ROLES.ADMIN]} />}>
              <Route path="/lab" element={<LabDashboard />} />
              <Route path="/lab/dashboard" element={<LabDashboard />} />
              <Route path="/lab/mushroom-management" element={<MushroomManagement />} />
              <Route path="/lab/lab-inventory" element={<LabInventory />} />
              <Route path="/lab/allocations" element={<AllocationManagement />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/materials" element={<MaterialManagement />} />
              <Route path="/admin/employees" element={<EmployeeManagement />} />
              <Route path="/admin/analytics/sales" element={<SalesReport />} />
              <Route path="/admin/analytics/labs" element={<LabReports />} />
            </Route>

            {/* Inventory Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.INVENTORY, ROLES.ADMIN]} />}>
              <Route path="/inventory" element={<Dashboard />} />
              <Route path="/inventory/dashboard" element={<Dashboard />} />
              <Route path="/inventory/raw" element={<Raw />} />
              <Route path="/inventory/management/:usageType?" element={<InventoryManagement />} />
              <Route path="/inventory/management/edit/:InvId" element={<InventoryManagement />} />
              <Route path="/inventory/supplier" element={<Supplier />} />
              <Route path="/inventory/stock" element={<Stock />} />
              <Route path="/inventory/supplier/save" element={<Supplier />} />
              <Route path="/inventory/supplier/edit/:SupplierId" element={<Supplier />} />
            </Route>

            {/* Sales Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.SALES, ROLES.ADMIN]} />}>
              <Route path="/sales" element={<SalesManagement />} />
              <Route path="/sales/management" element={<SalesManagement />} />
              <Route path="/sales/management/new" element={<SalesManagement />} />
              <Route path="/sales/preorders" element={<PreorderManagement />} />
              <Route path="/sales/preorders/new" element={<PreorderManagement />} />
              <Route path="/sales/inventory" element={<Inventory />} />
              <Route path="/sales/allocations" element={<AllocationComponent />} />
              <Route path="/sales/branches" element={<BranchComponent />} />
            </Route>

            {/* Catch all route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
