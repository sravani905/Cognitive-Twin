import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface SparkleBackgroundProps {
  className?: string;
  intensity?: 'normal' | 'rich';
}

export const SparkleBackground: React.FC<SparkleBackgroundProps> = ({ 
  className = '', 
  intensity = 'rich' 
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor-guided drift
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(nx * 30);
      mouseY.set(ny * 30);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Generate deterministic positions for sparkles so they remain stable across re-renders
  const sparkles = useMemo(() => {
    const arr = [
      { top: '12%', left: '8%', size: 28, delay: '0s', duration: '2.5s', scale: 1.1 },
      { top: '6%', left: '46%', size: 36, delay: '0.8s', duration: '3s', scale: 1.3 },
      { top: '24%', left: '85%', size: 30, delay: '1.5s', duration: '4s', scale: 1.0 },
      { top: '15%', left: '20%', size: 24, delay: '0.4s', duration: '2.8s', scale: 0.9 },
      { top: '48%', left: '92%', size: 40, delay: '1.1s', duration: '3.6s', scale: 1.25 },
      { top: '65%', left: '6%', size: 26, delay: '0.9s', duration: '2.4s', scale: 0.95 },
      { top: '88%', left: '32%', size: 30, delay: '2.2s', duration: '4.2s', scale: 1.05 },
      { top: '78%', left: '88%', size: 44, delay: '0.2s', duration: '3.2s', scale: 1.4 },
      { top: '35%', left: '50%', size: 22, delay: '1.7s', duration: '3s', scale: 0.8 },
      { top: '55%', left: '72%', size: 26, delay: '2.5s', duration: '3.8s', scale: 0.95 },
      { top: '80%', left: '15%', size: 30, delay: '0.7s', duration: '3.5s', scale: 1.1 },
      { top: '62%', left: '60%', size: 34, delay: '0.5s', duration: '2.9s', scale: 1.2 },
      { top: '18%', left: '32%', size: 18, delay: '1.9s', duration: '2.7s', scale: 0.7 },
      { top: '42%', left: '25%', size: 20, delay: '0.3s', duration: '2.4s', scale: 0.85 },
      // Additional high-density sparkles to match screenshot exactly
      { top: '5%', left: '15%', size: 28, delay: '2.1s', duration: '3.1s', scale: 1.0 },
      { top: '11%', left: '65%', size: 38, delay: '1.3s', duration: '3.9s', scale: 1.3 },
      { top: '30%', left: '10%', size: 22, delay: '0.6s', duration: '2.5s', scale: 0.85 },
      { top: '22%', left: '40%', size: 34, delay: '2.4s', duration: '3.3s', scale: 1.15 },
      { top: '14%', left: '76%', size: 28, delay: '1.0s', duration: '3.0s', scale: 1.0 },
      { top: '50%', left: '4%', size: 24, delay: '1.6s', duration: '2.8s', scale: 0.9 },
      { top: '40%', left: '82%', size: 32, delay: '2.9s', duration: '3.7s', scale: 1.2 },
      { top: '68%', left: '22%', size: 20, delay: '0.3s', duration: '2.3s', scale: 0.75 },
      { top: '58%', left: '48%', size: 30, delay: '1.5s', duration: '3.2s', scale: 1.1 },
      { top: '72%', left: '75%', size: 36, delay: '0.8s', duration: '2.9s', scale: 1.25 },
      { top: '85%', left: '55%', size: 22, delay: '2.6s', duration: '3.4s', scale: 0.8 },
      { top: '92%', left: '12%', size: 32, delay: '1.2s', duration: '4.0s', scale: 1.15 },
      { top: '95%', left: '78%', size: 26, delay: '2.0s', duration: '3.1s', scale: 0.95 }
    ];
    return intensity === 'rich' ? arr : arr.slice(0, 12);
  }, [intensity]);

  // Generate tiny shimmering circular background particles/dust
  const dustParticles = useMemo(() => {
    return Array.from({ length: 65 }).map((_, idx) => ({
      top: `${(idx * 7) % 95 + 3}%`,
      left: `${(idx * 13) % 95 + 3}%`,
      size: `${2 + (idx % 4)}px`,
      delay: `${(idx * 0.15).toFixed(2)}s`,
      duration: `${2 + (idx % 3)}s`
    }));
  }, []);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}>
      
      {/* 1. Main Background Swirling Color Gradients strictly matching the screenshots */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#988ada]/30 via-[#fcd5e8]/45 to-[#fff8f5]/40" />

      {/* 2. Soft, rich chromatic lighting orbs floating beneath */}
      <div className="absolute -top-[15%] -left-[10%] w-[55rem] h-[55rem] bg-gradient-to-br from-[#a78bfa]/25 via-[#f3e8ff]/25 to-transparent rounded-full blur-[100px] mix-blend-multiply opacity-80" />
      <div className="absolute -bottom-[20%] -right-[15%] w-[60rem] h-[60rem] bg-gradient-to-tl from-[#f472b6]/20 via-[#fbcfe8]/25 to-transparent rounded-full blur-[90px] mix-blend-screen opacity-90" />
      <div className="absolute top-[25%] left-[20%] w-[35rem] h-[35rem] bg-[#fff0f5]/20 rounded-full blur-[110px]" />
      <div className="absolute top-[40%] right-[10%] w-[40rem] h-[40rem] bg-[#eef2ff]/15 rounded-full blur-[120px]" />

      {/* 3. Mystical Sweeping Sine Paths (Satin Wave layers seen in Image 3 bottom) */}
      <svg className="absolute inset-x-0 bottom-0 w-full h-[50%] opacity-50 mix-blend-overlay" viewBox="0 0 1440 450" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="rgba(252, 213, 232, 0.35)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgba(255, 248, 245, 0.55)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="wave-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="rgba(152, 138, 218, 0.15)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.25)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path d="M-100,250 C300,100 800,400 1540,200 L1540,450 L-100,450 Z" fill="url(#wave-grad-1)" />
        <path d="M-50,320 C400,180 900,380 1500,260 L1500,450 L-50,450 Z" fill="url(#wave-grad-2)" />
        <path d="M-20,150 C400,60 810,340 1460,180" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" />
        <path d="M-20,180 C420,110 800,290 1460,220" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      </svg>

      {/* 4. Connected Neural/Graph wireframes located on top right & bottom left corners */}
      <motion.div 
        className="absolute top-[8%] right-[5%] w-[320px] h-[240px] opacity-[0.38] max-lg:hidden"
        style={{ x: springX, y: springY }}
      >
        <svg className="w-full h-full text-[#8161e1]" viewBox="0 0 200 150">
          <line x1="120" y1="20" x2="160" y2="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="160" y1="40" x2="180" y2="90" stroke="currentColor" strokeWidth="0.5" />
          <line x1="180" y1="90" x2="140" y2="120" stroke="currentColor" strokeWidth="0.5" />
          <line x1="140" y1="120" x2="90" y2="110" stroke="currentColor" strokeWidth="0.5" />
          <line x1="90" y1="110" x2="120" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="120" y1="20" x2="140" y2="120" stroke="currentColor" strokeWidth="0.5" />
          <line x1="160" y1="40" x2="90" y2="110" stroke="currentColor" strokeWidth="0.5" />
          
          <circle cx="120" cy="20" r="2.5" fill="currentColor" />
          <circle cx="160" cy="40" r="2.5" fill="currentColor" />
          <circle cx="180" cy="90" r="2.5" fill="currentColor" />
          <circle cx="140" cy="120" r="2.5" fill="currentColor" />
          <circle cx="90" cy="110" r="2.5" fill="currentColor" />

          {/* Connected delicate inner star lines */}
          <line x1="120" y1="20" x2="150" y2="70" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="160" y1="40" x2="150" y2="70" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="180" y1="90" x2="150" y2="70" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="140" y1="120" x2="150" y2="70" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="90" y1="110" x2="150" y2="70" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <circle cx="150" cy="70" r="1.8" fill="currentColor" opacity="0.8" />
        </svg>
      </motion.div>

      <motion.div 
        className="absolute bottom-[5%] left-[5%] w-[320px] h-[240px] opacity-[0.38] max-lg:hidden"
        style={{ x: useSpring(mouseX, { stiffness: 40, damping: 25 }), y: useSpring(mouseY, { stiffness: 40, damping: 25 }) }}
        animate={{
          x: -mouseX.get() * 0.8,
          y: -mouseY.get() * 0.8
        }}
      >
        <svg className="w-full h-full text-[#8161e1]" viewBox="0 0 200 150">
          <line x1="40" y1="120" x2="80" y2="130" stroke="currentColor" strokeWidth="0.5" />
          <line x1="80" y1="130" x2="110" y2="90" stroke="currentColor" strokeWidth="0.5" />
          <line x1="110" y1="90" x2="70" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="70" y1="50" x2="30" y2="70" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="70" x2="40" y2="120" stroke="currentColor" strokeWidth="0.5" />
          <line x1="40" y1="120" x2="70" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="80" y1="130" x2="30" y2="70" stroke="currentColor" strokeWidth="0.5" />

          <circle cx="40" cy="120" r="2.5" fill="currentColor" />
          <circle cx="80" cy="130" r="2.5" fill="currentColor" />
          <circle cx="110" cy="90" r="2.5" fill="currentColor" />
          <circle cx="70" cy="50" r="2.5" fill="currentColor" />
          <circle cx="30" cy="70" r="2.5" fill="currentColor" />

          {/* Inner mesh connections */}
          <line x1="40" y1="120" x2="65" y2="95" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="80" y1="130" x2="65" y2="95" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="110" y1="90" x2="65" y2="95" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="70" y1="50" x2="65" y2="95" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <line x1="30" y1="70" x2="65" y2="95" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <circle cx="65" cy="95" r="1.8" fill="currentColor" opacity="0.8" />
        </svg>
      </motion.div>

      {/* 5. Floating Geometrical Outline Trace elements strictly matching Image 3 */}
      {/* Top Right Triangle */}
      <svg className="absolute top-[14%] right-[11%] w-14 h-14 text-white/35 font-light" viewBox="0 0 50 50">
        <polygon points="25,5 45,40 5,40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </svg>
      {/* Top Right Circle behind it */}
      <svg className="absolute top-[9%] right-[18%] w-10 h-10 text-white/25" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      {/* Floating hollow Square */}
      <svg className="absolute top-[28%] right-[25%] w-6 h-6 text-white/20 rotate-[15deg]" viewBox="0 0 50 50">
        <rect x="5" y="5" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      {/* Left Triangle */}
      <svg className="absolute top-[34%] left-[7%] w-12 h-12 text-[#fcd5e8]/45" viewBox="0 0 50 50">
        <polygon points="25,45 45,10 5,10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </svg>
      {/* Center Left small hollow circle */}
      <svg className="absolute top-[48%] left-[2%] w-11 h-11 text-white/20" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      {/* Middle right floating outline circle */}
      <svg className="absolute bottom-[35%] right-[12%] w-12 h-12 text-white/25" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="16" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* 6. Dynamic Shimmering Micro Star Dust */}
      {dustParticles.map((dust, dIdx) => (
        <div 
          key={`dust-${dIdx}`}
          className="absolute bg-white rounded-full animate-pulse opacity-40 pointer-events-none"
          style={{
            top: dust.top,
            left: dust.left,
            width: dust.size,
            height: dust.size,
            animationDelay: dust.delay,
            animationDuration: dust.duration,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.4)'
          }}
        />
      ))}

      {/* 7. Pixel high-fidelity Glowing 4-pointed Sparkle Stars exactly as requested */}
      {sparkles.map((star, idx) => (
        <div 
          key={`sparkle-${idx}`} 
          className="absolute text-white animate-pulse pointer-events-none" 
          style={{ 
            top: star.top, 
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.7))',
            transform: `scale(${star.scale})`
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white/70">
            <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3Z" />
          </svg>
        </div>
      ))}

    </div>
  );
};
