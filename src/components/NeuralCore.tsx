import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const NeuralCore = () => {
  // Motion values for global mouse positions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to animate the parallax translations gracefully
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate factors around center [-0.5, 0.5]
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      
      // Target translations of up to 25px max
      mouseX.set(nx * 25);
      mouseY.set(ny * 25);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Neural Network Clusters (Corners) - Exactly like the layout in Image 1 */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top Right Cluster - High Density Blue (Moves in direction of mouse) */}
        <motion.g 
          className="opacity-60"
          style={{ x: springX, y: springY }}
        >
          {[
            {x: 82, y: 8}, {x: 88, y: 12}, {x: 85, y: 18}, 
            {x: 92, y: 6}, {x: 94, y: 15}, {x: 78, y: 14},
            {x: 86, y: 4}, {x: 90, y: 22}, {x: 80, y: 20}
          ].map((pt, i, arr) => (
            <React.Fragment key={`tr-${i}`}>
              {arr.slice(i + 1).map((next, j) => (
                <line 
                  key={`l-${i}-${j}`}
                  x1={`${pt.x}%`} y1={`${pt.y}%`}
                  x2={`${next.x}%`} y2={`${next.y}%`}
                  stroke="#00AEEF"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />
              ))}
              <circle 
                cx={`${pt.x}%`} cy={`${pt.y}%`} r="3.5" 
                fill="#00AEEF" 
                filter="url(#glow)"
              />
              <circle 
                cx={`${pt.x}%`} cy={`${pt.y}%`} r="12" 
                fill="url(#node-glow)" 
              />
            </React.Fragment>
          ))}
        </motion.g>

        {/* Bottom Left Cluster - High Density Purple (Moves in opposite direction of mouse for parallax) */}
        <motion.g 
          className="opacity-50"
          style={{
            x: useSpring(useMotionValue(0), { stiffness: 60, damping: 20 }), // We'll compute opposite programmatically
            y: useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
          }}
          // Hooking opposite interpolation natively
          animate={{
            x: -mouseX.get() * 1.2,
            y: -mouseY.get() * 1.2
          }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        >
          {[
            {x: 8, y: 82}, {x: 12, y: 88}, {x: 18, y: 85}, 
            {x: 6, y: 92}, {x: 15, y: 94}, {x: 14, y: 78},
            {x: 4, y: 86}, {x: 22, y: 90}, {x: 20, y: 80}
          ].map((pt, i, arr) => (
            <React.Fragment key={`bl-${i}`}>
              {arr.slice(i + 1).map((next, j) => (
                <line 
                  key={`l-${i}-${j}`}
                  x1={`${pt.x}%`} y1={`${pt.y}%`}
                  x2={`${next.x}%`} y2={`${next.y}%`}
                  stroke="#8A2BE2"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />
              ))}
              <circle 
                cx={`${pt.x}%`} cy={`${pt.y}%`} r="3.5" 
                fill="#8A2BE2" 
                filter="url(#glow)"
              />
              <circle 
                cx={`${pt.x}%`} cy={`${pt.y}%`} r="12" 
                fill="url(#node-glow)" 
              />
            </React.Fragment>
          ))}
        </motion.g>
      </svg>
    </div>
  );
};

