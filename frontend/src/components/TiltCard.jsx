import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({ children, className = '', depth = 15 }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate distance from center to boundaries [-1, 1]
    const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
    const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);
    
    // Invert X because moving mouse UP (negative Y) should rotate top BACK (positive rotateX)
    setRotateX(-mouseY * depth);
    setRotateY(mouseX * depth);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        willChange: 'transform',
        width: '100%',
        height: '100%'
      }}
    >
      <div 
        style={{ 
          transform: 'translateZ(30px)', 
          width: '100%', 
          height: '100%', 
          transition: 'transform 0.1s ease-out' 
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
