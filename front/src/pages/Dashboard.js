import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import mushroomGrowth from "../PlantAnimation.json";
import { FaSeedling, FaFlask, FaChartLine, FaBoxOpen } from 'react-icons/fa';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const quickActions = [
    { 
      icon: <FaSeedling className="text-success" size="2em" />,
      title: "Lab Cultures",
      description: "Monitor active mushroom cultures",
      link: "/lab"
    },
    { 
      icon: <FaFlask className="text-info" size="2em" />,
      title: "Production",
      description: "View cultivation progress",
      link: "/lab/mushroom-management"
    },
    { 
      icon: <FaChartLine className="text-warning" size="2em" />,
      title: "Sales Analytics",
      description: "Branch performance & trends",
      link: "/admin/analytics/sales"
    },
    { 
      icon: <FaBoxOpen className="text-danger" size="2em" />,
      title: "Inventory",
      description: "Manage raw materials",
      link: "/inventory/management"
    }
  ];
  return (
    <>
      {/* Hero Section */}
      <div className="page-header">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold text-success mb-3">
              Welcome to FungiFlow
              <div className="sub-brand fs-4 mt-2">MTDC Production Management</div>
            </h1>
            <p className="lead text-muted">
              Managing 85% of Sri Lanka's mushroom cultivation - Tracking 5 varieties across 4 facilities
            </p>
          </div>
          <div className="col-lg-6">
            <Lottie 
              animationData={mushroomGrowth} 
              style={{ height: 200 }} 
            />
          </div>
        </div>
      </div>

          {/* Quick Actions */}
      <div className="content-card">
        <h3 className="mb-4 fw-bold text-success">Core Operations</h3>
        <div className="row g-4">
        {quickActions.map((action, index) => (
          <div key={index} className="col-12 col-md-6 col-xl-3">
            <div 
              className="card border-0 shadow-sm h-100 hover-scale"
              onClick={() => navigate(action.link)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                    {action.icon}
                  </div>
                  <h5 className="mb-0 fw-bold">{action.title}</h5>
                </div>
                <p className="text-muted mb-0">{action.description}</p>
              </div>
            </div>
          </div>        ))}
        </div>
      </div>

      {/* Production Overview */}
      <div className="content-card">
        <div className="row g-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Cultivation Varieties</h5>
              </div>
              <div className="card-body">
                <div className="row g-4 text-center">
                  {['American Oyster', 'Abalone', 'Bhutan Oyster', 'Pink Oyster', 'Milky'].map((variety, idx) => (
                    <div key={idx} className="col">
                      <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block">
                        <FaSeedling className="text-success" size="1.5em" />
                      </div>
                      <div className="mt-2 small fw-bold">{variety}</div>
                      <div className="text-muted small">1-2 weeks cycle</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
