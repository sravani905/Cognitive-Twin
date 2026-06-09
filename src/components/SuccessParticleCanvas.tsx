import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  shape: 'circle' | 'square' | 'star';
}

export const SuccessParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle color palettes representing our theme accents:
    const palette = [
      '#8161e1', // primary violet
      '#a78bfa', // secondary lavender
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ec4899', // pink
      '#06b6d4', // cyan
    ];

    const createExplosion = (x: number, y: number, count: number, type: 'test' | 'milestone') => {
      const isTest = type === 'test';
      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Faster velocities for tests (starbursts), slower floating speeds for milestones
        const speed = isTest 
          ? (Math.random() * 12 + 5) 
          : (Math.random() * 8 + 3);

        const color = palette[Math.floor(Math.random() * palette.length)];
        const shapes: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isTest ? 4 : 2), // upward bias
          color,
          radius: Math.random() * 4 + (isTest ? 3 : 2),
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01,
          gravity: 0.18,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          width: Math.random() * 8 + 4,
          height: Math.random() * 12 + 6,
          shape
        });
      }

      particlesRef.current.push(...particles);
    };

    // Confetti cannon blast from left & right bottom corners
    const spawnCannons = () => {
      const leftX = 0;
      const rightX = window.innerWidth;
      const bottomY = window.innerHeight;

      // Left blast points up and right (approx -30 to -60 degrees)
      for (let i = 0; i < 45; i++) {
        const angle = -Math.PI / 6 - Math.random() * (Math.PI / 4);
        const speed = Math.random() * 15 + 10;
        const color = palette[Math.floor(Math.random() * palette.length)];
        particlesRef.current.push({
          x: leftX,
          y: bottomY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          radius: Math.random() * 3 + 2,
          alpha: 1,
          decay: Math.random() * 0.01 + 0.008,
          gravity: 0.22,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          width: Math.random() * 10 + 6,
          height: Math.random() * 14 + 8,
          shape: Math.random() > 0.4 ? 'square' : 'circle'
        });
      }

      // Right blast points up and left (approx -120 to -150 degrees)
      for (let i = 0; i < 45; i++) {
        const angle = -Math.PI / 1.2 - Math.random() * (Math.PI / 4);
        const speed = Math.random() * 15 + 10;
        const color = palette[Math.floor(Math.random() * palette.length)];
        particlesRef.current.push({
          x: rightX,
          y: bottomY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          radius: Math.random() * 3 + 2,
          alpha: 1,
          decay: Math.random() * 0.01 + 0.008,
          gravity: 0.22,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          width: Math.random() * 10 + 6,
          height: Math.random() * 14 + 8,
          shape: Math.random() > 0.4 ? 'square' : 'circle'
        });
      }
    };

    const handleSuccessEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const type = customEvent.detail?.type || 'milestone';

      if (type === 'test') {
        // Starburst in center + dual corner cannons for grand completion
        createExplosion(window.innerWidth / 2, window.innerHeight * 0.4, 60, 'test');
        spawnCannons();
      } else {
        // Milestone: Elegant bursts from target positions
        createExplosion(window.innerWidth / 2, window.innerHeight / 2, 40, 'milestone');
        // Gentle side sprinkles
        setTimeout(() => {
          createExplosion(window.innerWidth * 0.25, window.innerHeight * 0.6, 20, 'milestone');
          createExplosion(window.innerWidth * 0.75, window.innerHeight * 0.6, 20, 'milestone');
        }, 150);
      }
    };

    window.addEventListener('cognitive-success-particles', handleSuccessEvent);

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'square') {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.width, p.width / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('cognitive-success-particles', handleSuccessEvent);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      id="success-particle-overlay"
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
};
