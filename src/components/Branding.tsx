import React from 'react';
import { motion } from 'motion/react';

export const MeshBrain = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="twin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00AEEF" />
        <stop offset="50%" stopColor="#8A2BE2" />
        <stop offset="100%" stopColor="#00AEEF" />
      </linearGradient>
      <filter id="twin-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Symmetrical Infinity Neural Path */}
    <motion.path 
      d="M30 50 C 30 30, 45 30, 50 50 C 55 70, 70 70, 70 50 C 70 30, 55 30, 50 50 C 45 70, 30 70, 30 50" 
      stroke="url(#twin-gradient)" 
      strokeWidth="3" 
      strokeLinecap="round" 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    />

    {/* Secondary Mirror Path */}
    <motion.path 
      d="M30 50 C 30 70, 45 70, 50 50 C 55 30, 70 30, 70 50 C 70 70, 55 70, 50 50 C 45 30, 30 30, 30 50" 
      stroke="url(#twin-gradient)" 
      strokeWidth="1" 
      strokeOpacity="0.3"
    />

    {/* Focal Synapse Nodes */}
    <g fill="url(#twin-gradient)" filter="url(#twin-glow)">
      {/* Left Node */}
      <motion.circle 
        cx="30" cy="50" r="3" 
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Center Synthesis Node */}
      <motion.circle 
        cx="50" cy="50" r="4" 
        animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 0px #fff", "0 0 10px #fff", "0 0 0px #fff"] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Right Node */}
      <motion.circle 
        cx="70" cy="50" r="3" 
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </g>

    {/* Connectivity Orbitals */}
    <circle cx="50" cy="50" r="25" stroke="url(#twin-gradient)" strokeWidth="0.5" strokeDasharray="2 4" strokeOpacity="0.2">
      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
    </circle>
    <circle cx="50" cy="50" r="35" stroke="url(#twin-gradient)" strokeWidth="0.5" strokeDasharray="1 6" strokeOpacity="0.1">
      <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="15s" repeatCount="indefinite" />
    </circle>
  </svg>
);
