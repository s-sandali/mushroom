import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import plantGrow from "../PlantAnimation.json"; // Use your existing Lottie animation
import { useAuth } from '../auth/AuthContext';
import { roleToHome } from '../auth/roles';

export default function Name() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (user?.role) {
          navigate(roleToHome(user.role));
        } else {
          navigate('/Login');
        }
      }, 900);
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  const text = "Fungi Flow";
  const subtitle = "All-in-one platform for smart mushroom farming";

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={fadeOut ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <div className="mb-3">
          <Lottie animationData={plantGrow} style={{ height: 120, margin: "0 auto" }} />
        </div>
        <motion.h1
          className="fw-bold text-success display-3 mb-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.07 }
            }
          }}
        >
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5, type: "spring" }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.div
          className="fs-5 text-muted mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {subtitle}
        </motion.div>
        <motion.div
          className="fw-semibold text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          Powered by Mushroom Development and Training Centre
        </motion.div>
      </motion.div>
    </div>
  );
}
