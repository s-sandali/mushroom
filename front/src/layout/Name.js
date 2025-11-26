import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import {
  FaShieldAlt,
  FaLeaf,
  FaChartBar,
  FaUsersCog,
  FaWarehouse,
  FaTruck,
  FaFlask,
  FaArrowRight,
  FaQuoteLeft
} from 'react-icons/fa';

import plantGrow from '../PlantAnimation.json';
import { useAuth } from '../auth/AuthContext';
import { roleToHome } from '../auth/roles';

const stats = [
  { label: 'Cycle Time', value: '18% faster' },
  { label: 'Waste Reduction', value: '32% lower' },
  { label: 'Role Coverage', value: '4 core teams' },
  { label: 'Data Freshness', value: 'Real-time' }
];

const modules = [
  {
    icon: <FaFlask />,
    title: 'Lab Intelligence',
    description: 'Culture tracking, contamination insights, and automated quality locks.'
  },
  {
    icon: <FaWarehouse />,
    title: 'Inventory Control',
    description: 'Material receiving, batch reservations, and live stock reconciliation.'
  },
  {
    icon: <FaTruck />,
    title: 'Sales & Fulfillment',
    description: 'Preorder pipelines with branch allocation and fulfillment forecasting.'
  },
  {
    icon: <FaUsersCog />,
    title: 'Executive Oversight',
    description: 'Portfolio dashboards, KPI guardrails, and role-aware approvals.'
  }
];

const workflow = [
  'Plan demand with synced sales and lab capacity.',
  'Trigger cultivation batches with auto inventory locks.',
  'Monitor lab progress, success rates, and interventions.',
  'Ship finished product with branch-ready allocations.'
];

const testimonials = [
  {
    quote: 'FungiFlow replaced six spreadsheets and gave us predictable harvest cadences.',
    author: 'Operations Director, MTDC'
  },
  {
    quote: 'The dashboards are boardroom-ready. We finally speak one operational language.',
    author: 'Chief Strategy Officer'
  }
];

export default function Name() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role) {
      navigate(roleToHome(user.role));
    }
  }, [loading, user, navigate]);

  return (
    <div className="landing-pro">
      <div className="landing-hero-pro container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="eyebrow">Integrated MTDC command</p>
              <h1>Guide every harvest from one orchestrated workspace.</h1>
              <p className="lead">
                FungiFlow synchronizes lab science, inventory control, and revenue execution so each role operates from the same real-time truth.
              </p>
              <div className="cta-group">
                <button className="btn btn-light btn-lg" onClick={() => navigate('/Login')}>
                  Launch console
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/Signup')}>
                  Request access <FaArrowRight className="ms-2" />
                </button>
              </div>
              <div className="stat-grid">
                {stats.map((item) => (
                  <div key={item.label} className="stat-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="visual-card">
                <Lottie animationData={plantGrow} style={{ height: 260 }} />
                <div className="visual-meta">
                  <FaChartBar /> Operational insights refresh every 15 seconds.
                </div>
                <div className="visual-meta">
                  <FaShieldAlt /> SOC2-ready authentication with role isolation.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="trust-bar">
        <div className="container d-flex flex-wrap justify-content-center gap-4 text-uppercase fw-semibold">
          <span>ISO-22000 Labs</span>
          <span>Realtime ERP Feed</span>
          <span>Executive KPI Suite</span>
          <span>Global Inventory Lens</span>
        </div>
      </section>

      <section className="container py-5">
        <div className="section-heading">
          <p className="eyebrow">Modules</p>
          <h2>Purpose-built surfaces for every stakeholder.</h2>
        </div>
        <div className="row g-4">
          {modules.map((module) => (
            <div className="col-md-6 col-lg-3" key={module.title}>
              <motion.div className="module-card" whileHover={{ y: -6 }}>
                <div className="module-icon">{module.icon}</div>
                <h5>{module.title}</h5>
                <p>{module.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow-section container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5">
            <p className="eyebrow">Operating Rhythm</p>
            <h2>Digitize the full cultivation-to-fulfillment runway.</h2>
            <p>
              Every milestone in the mushroom lifecycle is timestamped, audited, and surfaced to the right decision maker so nothing slips.
            </p>
          </div>
          <div className="col-lg-7">
            <ol className="workflow-steps">
              {workflow.map((step, index) => (
                <li key={step}>
                  <span className="step-index">0{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="container">
          <div className="row g-4">
            {testimonials.map((item) => (
              <div className="col-md-6" key={item.author}>
                <div className="testimonial-card">
                  <FaQuoteLeft className="quote-icon" />
                  <p>{item.quote}</p>
                  <span>{item.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section container text-center py-5">
        <p className="eyebrow">Get Started</p>
        <h2>Ready to align labs, inventory, and sales?</h2>
        <p className="mb-4">Spin up your secure workspace in minutes and invite every team lead to a single source of truth.</p>
        <button className="btn btn-success btn-lg px-5" onClick={() => navigate('/Signup')}>
          Create your workspace
        </button>
      </section>
    </div>
  );
}
