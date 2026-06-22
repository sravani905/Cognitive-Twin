import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, SkipForward, Cpu, Volume2, VolumeX } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  hemisphere: 'left' | 'right';
  lobe: string;
}

const generateSeededBrainVertices = (): Point3D[] => {
  const vertices: Point3D[] = [];
  let seed = 42;

  const nextRand = () => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // 145 cerebrum points
  for (let i = 0; i < 145; i++) {
    let theta = Math.acos((nextRand() * 2) - 1);
    let phi = nextRand() * Math.PI * 2;

    let r = 135;
    let dx = Math.sin(theta) * Math.cos(phi);
    let dy = Math.cos(theta);
    let dz = Math.sin(theta) * Math.sin(phi);

    if (dy < -0.15) {
      dy *= 0.65;
    }
    dz *= 1.35; // elongated front-to-back

    // hemisphere cleft (indentation)
    let indent = 1.0;
    if (Math.abs(dx) < 0.22) {
      indent = 0.55 + 2.0 * Math.abs(dx);
    }

    // gyri folds
    let folds = 1.0 + 0.12 * Math.sin(theta * 9.5) * Math.cos(phi * 9.5);
    
    let xVal = dx * r * indent * folds;
    let yVal = dy * r * 0.9 * folds + 15; // move slightly up
    let zVal = dz * r * indent * folds;

    vertices.push({
      x: xVal,
      y: yVal,
      z: zVal,
      hemisphere: dx < 0 ? 'left' : 'right',
      lobe: dy > 0.35 ? 'parietal' : (dz > 0.25 ? 'frontal' : (dz < -0.25 ? 'occipital' : 'temporal'))
    });
  }

  // 40 cerebellum points
  for (let i = 0; i < 40; i++) {
    let theta = nextRand() * Math.PI * 0.4 + Math.PI * 0.5;
    let phi = nextRand() * Math.PI + Math.PI;

    let r = 75;
    let dx = Math.sin(theta) * Math.cos(phi);
    let dy = Math.cos(theta) - 0.45;
    let dz = Math.sin(theta) * Math.sin(phi) - 0.45;

    let folds = 1.0 + 0.08 * Math.sin(theta * 12) * Math.cos(phi * 12);

    vertices.push({
      x: dx * r * folds,
      y: dy * r * 0.7 * folds - 25,
      z: dz * r * 1.05 * folds,
      hemisphere: dx < 0 ? 'left' : 'right',
      lobe: 'cerebellum'
    });
  }

  // 15 brain stem points
  for (let i = 0; i < 15; i++) {
    let t = i / 15;
    let r = 16 - t * 5;
    let angle = (i * 0.8) * Math.PI * 2;
    vertices.push({
      x: Math.cos(angle) * r,
      y: -95 - t * 55,
      z: -10 + Math.sin(angle) * r - t * 15,
      hemisphere: 'right',
      lobe: 'stem'
    });
  }

  return vertices;
};

const brainVertices = generateSeededBrainVertices();

function getLobeColor(lobe: string, elapsed: number): string {
  switch (lobe) {
    case 'frontal': return '#00AEEF'; // brand blue (cyber cyan)
    case 'parietal': return '#8A2BE2'; // brand purple (blue-violet)
    case 'occipital': return '#a78bfa'; // brand violet
    case 'temporal': return '#a78bfa'; // brand violet
    case 'cerebellum': return '#8A2BE2'; // brand purple (blue-violet)
    case 'stem': return '#10b981'; // brand emerald
    default: return '#ffffff';
  }
}

function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  let mapped = outMin + ((val - inMin) * (outMax - outMin)) / (inMax - inMin);
  return Math.max(Math.min(mapped, Math.max(outMin, outMax)), Math.min(outMin, outMax));
}

function hexToRGBA(hex: string, alpha: number): string {
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [introStep, setIntroStep] = useState(0); // 0 = initial white, 1 = pink, 2 = text reveal

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isCancelled = false;

    const V_WIDTH = 1920;
    const V_HEIGHT = 1080;

    let mouse = { 
      x: V_WIDTH / 2, 
      y: V_HEIGHT / 2, 
      targetX: V_WIDTH / 2, 
      targetY: V_HEIGHT / 2 
    };

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      let scale = Math.min(canvas.width / V_WIDTH, canvas.height / V_HEIGHT);
      let offsetX = (canvas.width - V_WIDTH * scale) / 2;
      let offsetY = (canvas.height - V_HEIGHT * scale) / 2;
      mouse.targetX = (e.clientX - offsetX) / scale;
      mouse.targetY = (e.clientY - offsetY) / scale;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function easeInOutQuint(t: number) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
    }

    // --- DEEP ENVIRONMENT BACKGROUND SYSTEMS ---
    function drawCinematicGrid(elapsed: number) {
      if (!ctx) return;
      ctx.save();
      let dx = (mouse.x - V_WIDTH / 2) * 0.008;
      let dy = (mouse.y - V_HEIGHT / 2) * 0.008;
      
      ctx.strokeStyle = "rgba(138, 43, 226, 0.075)"; // brand purple gradient grid link
      ctx.lineWidth = 1;
      
      let gridSize = 60; // Denser engineering grid for premium assets
      let startX = (dx % gridSize) - gridSize;
      let startY = (dy % gridSize) - gridSize;

      ctx.beginPath();
      for (let x = startX; x < V_WIDTH + gridSize; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, V_HEIGHT);
      }
      for (let y = startY; y < V_HEIGHT + gridSize; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(V_WIDTH, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    class BackgroundLightBeam {
      x: number;
      speed: number;
      width: number;
      alpha: number;

      constructor(x: number, speed: number, width: number, alpha: number) {
        this.x = x; this.speed = speed; this.width = width; this.alpha = alpha;
      }
      update() {
        this.x += this.speed;
        if (this.x > V_WIDTH + 300) this.x = -300;
        if (this.x < -300) this.x = V_WIDTH + 300;
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        let grad = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        grad.addColorStop(0, "rgba(138, 43, 226, 0)"); // brand purple
        grad.addColorStop(0.5, `rgba(138, 43, 226, ${this.alpha})`);
        grad.addColorStop(1, "rgba(138, 43, 226, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(this.x, 0, this.width, V_HEIGHT);
        ctx.restore();
      }
    }

    const ambientBeams = [
      new BackgroundLightBeam(100, 0.3, 400, 0.05),
      new BackgroundLightBeam(700, 0.15, 500, 0.04),
      // Reverse scanning back light beam for complex refraction depths
      new BackgroundLightBeam(1300, -0.2, 350, 0.03),
      new BackgroundLightBeam(1800, 0.4, 300, 0.04)
    ];

    function drawBrainPanel(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
      ctx.save();
      ctx.fillStyle = "#00AEEF"; // brand blue
      ctx.font = "bold 13px 'Space Grotesk', system-ui";
      ctx.fillText("SYNAPSE ARTIFACT SCAN // 2D", -w/2 + 25, -h/2 + 35);
      ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("TWIN INTEGRITY: NORMAL [98%]", -w/2 + 25, -h/2 + 48);

      ctx.strokeStyle = "rgba(0, 174, 239, 0.2)";
      ctx.strokeRect(-w/2 + 20, -h/2 + 65, w - 40, h - 90);

      ctx.translate(0, 30);

      ctx.strokeStyle = "rgba(0, 174, 239, 0.12)";
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 174, 239, 0.55)"; // brand blue curve
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(0, -75);
      ctx.bezierCurveTo(-38, -75, -62, -45, -62, -12);
      ctx.bezierCurveTo(-62, 16, -38, 48, -12, 56);
      ctx.bezierCurveTo(-8, 60, -2, 64, 0, 68);
      ctx.stroke();

      ctx.strokeStyle = "rgba(138, 43, 226, 0.55)"; // brand purple curve
      ctx.beginPath();
      ctx.moveTo(0, -75);
      ctx.bezierCurveTo(38, -75, 62, -45, 62, -12);
      ctx.bezierCurveTo(62, 16, 38, 48, 12, 56);
      ctx.bezierCurveTo(8, 60, 2, 64, 0, 68);
      ctx.stroke();

      ctx.strokeStyle = "rgba(179, 165, 226, 0.4)"; // brand border subtle
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, -75); ctx.lineTo(0, 68); ctx.stroke();

      const nodes = [
        { x: -28, y: -38, r: 4, color: "#00AEEF" },     // brand blue
        { x: 28, y: -38, r: 4, color: "#8A2BE2" },      // brand purple
        { x: -42, y: -8, r: 4, color: "#a78bfa" },      // brand violet
        { x: 42, y: -8, r: 4, color: "#a78bfa" },       // brand violet
        { x: -20, y: 24, r: 4, color: "#00AEEF" },      // brand blue
        { x: 20, y: 24, r: 4, color: "#8A2BE2" },      // brand purple
        { x: -8, y: 50, r: 3.5, color: "#a78bfa" },     // brand violet
        { x: 8, y: 50, r: 3.5, color: "#8A2BE2" }       // violet brand point
      ];

      ctx.strokeStyle = "rgba(179, 165, 226, 0.15)";

      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.abs(nodes[i].x - nodes[j].x) < 65 && Math.abs(nodes[i].y - nodes[j].y) < 65) {
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }
        }
      }
      ctx.stroke();

      nodes.forEach((n, idx) => {
        let p = (elapsed * 2.2 + idx * 0.4) % Math.PI;
        let sizeBonus = Math.sin(p) * 1.8;
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + sizeBonus, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();
    }

    function drawReportCardPanel(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
      ctx.save();
      ctx.fillStyle = "#8A2BE2"; // brand purple
      ctx.font = "bold 13px 'Space Grotesk', system-ui";
      ctx.fillText("COGNITIVE DOSSIER TRANSCRIPT", -w/2 + 25, -h/2 + 35);
      ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("RECORD ARCHIVE: CONFIDENTIAL", -w/2 + 25, -h/2 + 48);

      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(-w/2 + 20, -h/2 + 65, w - 40, h - 90);
      ctx.strokeStyle = "rgba(179, 165, 226, 0.3)";
      ctx.strokeRect(-w/2 + 20, -h/2 + 65, w - 40, h - 90);

      ctx.fillStyle = "rgba(138, 43, 226, 0.18)";
      for(let i = 0; i < 15; i++) {
        let barW = (i % 3 === 0) ? 4 : (i % 2 === 0 ? 1 : 2.5);
        ctx.fillRect(w/2 - 70 + i * 3, -h/2 + 25, barW, 20);
      }

      const subjects = [
        { name: "LOGICAL INTUITION", score: "A+", percentage: 98, color: "#00AEEF" },       // brand blue
        { name: "WORKING MEMORY CAP", score: "96%", percentage: 96, color: "#8A2BE2" },     // brand purple
        { name: "ATTENTIONAL FOCUS", score: "142 FPS", percentage: 89, color: "#a78bfa" },    // brand violet
        { name: "CIRCADIAN SYNC RATE", score: "OPTIMAL", percentage: 94, color: "#10b981" }, // brand emerald
        { name: "RETENTION EFFICIENCY", score: "93%", percentage: 93, color: "#a78bfa" }    // brand violet
      ];

      subjects.forEach((subj, idx) => {
        let yPos = -h/2 + 105 + idx * 64;
        
        ctx.fillStyle = "#1e1a42"; // brand deep text
        ctx.font = "bold 10px 'Space Grotesk', system-ui";
        ctx.fillText(subj.name, -w/2 + 35, yPos);

        ctx.fillStyle = subj.color;
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.fillText(subj.score, w/2 - 35, yPos);
        ctx.textAlign = "left";

        ctx.strokeStyle = "rgba(179, 165, 226, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-w/2 + 35, yPos + 10, w - 70, 6);

        ctx.fillStyle = subj.color;
        let barWidth = (w - 70) * (subj.percentage / 100);
        ctx.fillRect(-w/2 + 35, yPos + 11, barWidth, 4);
      });

      ctx.save();
      ctx.translate(0, h/2 - 50);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 6px 'Space Grotesk', system-ui";
      ctx.textAlign = "center";
      ctx.fillText("COGNITIVE", 0, -3);
      ctx.fillText("APPROVED", 0, 5);
      ctx.restore();

      ctx.restore();
    }


        function drawCognitiveChartPanel(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
      ctx.save();
      ctx.fillStyle = "#8A2BE2"; // brand purple
      ctx.font = "bold 13px 'Space Grotesk', system-ui";
      ctx.fillText("CHRONOPEAK DIAGNOSIS STABILITY", -w/2 + 25, -h/2 + 35);
      ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("POLAR COGNITIVE AMPLITUDES", -w/2 + 25, -h/2 + 48);

      ctx.translate(0, 20);

      const maxRadius = Math.min(w, h) * 0.32;
      const sides = 5;
      const labels = ["Attentiveness", "Recall Span", "Logic", "Efficiency", "Retention"];
      const values = [0.85, 0.92, 0.78, 0.88, 0.93];

      ctx.lineWidth = 1;
      for (let r = 1; r <= 4; r++) {
        let currentRadius = maxRadius * (r / 4);
        ctx.strokeStyle = r === 4 ? "rgba(138, 43, 226, 0.25)" : "rgba(179, 165, 226, 0.15)";
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          let angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
          let px = Math.cos(angle) * currentRadius;
          let py = Math.sin(angle) * currentRadius;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(179, 165, 226, 0.25)";
      for (let i = 0; i < sides; i++) {
        let angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
        ctx.stroke();

        let labelPx = Math.cos(angle) * (maxRadius + 18);
        let labelPy = Math.sin(angle) * (maxRadius + 10);
        ctx.fillStyle = "#4a456e"; // brand secondary text
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], labelPx, labelPy);
      }

      ctx.fillStyle = "rgba(138, 43, 226, 0.22)";
      ctx.strokeStyle = "#8A2BE2"; // brand purple
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        let angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
        let pulsate = 1.0 + Math.sin(elapsed * 2.5 + i) * 0.03;
        let valRadius = maxRadius * values[i] * pulsate;
        let px = Math.cos(angle) * valRadius;
        let py = Math.sin(angle) * valRadius;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#8A2BE2";
      for (let i = 0; i < sides; i++) {
        let angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
        let valRadius = maxRadius * values[i] * (1.0 + Math.sin(elapsed * 2.5 + i) * 0.03);
        let px = Math.cos(angle) * valRadius;
        let py = Math.sin(angle) * valRadius;

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#8A2BE2"; // brand purple shadow
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }


    function drawFocusWavePanel(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
      ctx.save();
      ctx.fillStyle = "#00AEEF"; // brand blue
      ctx.font = "bold 13px 'Space Grotesk', system-ui";
      ctx.fillText("ATTENTIONAL RESONANCE OSCILLOSCOPE", -w/2 + 25, -h/2 + 35);
      ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("COHERENT FOCUS BANDWIDTH SAMPLES", -w/2 + 25, -h/2 + 48);

      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(-w/2 + 20, -h/2 + 65, w - 40, h - 95);
      ctx.strokeStyle = "rgba(0, 174, 239, 0.15)"; // brand blue outline
      ctx.strokeRect(-w/2 + 20, -h/2 + 65, w - 40, h - 95);

      ctx.strokeStyle = "rgba(0, 174, 239, 0.08)"; // brand blue grid
      ctx.lineWidth = 1;
      const ox = -w/2 + 20;
      const oy = -h/2 + 65;
      const ow = w - 40;
      const oh = h - 95;

      for (let gx = ox + 40; gx < ox + ow; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, oy); ctx.lineTo(gx, oy + oh); ctx.stroke();
      }
      for (let gy = oy + 30; gy < oy + oh; gy += 30) {
        ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + ow, gy); ctx.stroke();
      }

      const waveDetails = [
        { color: "#00AEEF", speed: 4.5, freq: 0.04, amp: 20, phase: 0 },       // brand blue oscillator
        { color: "#8A2BE2", speed: -3.0, freq: 0.02, amp: 12, phase: Math.PI / 3 } // brand purple oscillator
      ];

      ctx.shadowBlur = 10;
      waveDetails.forEach(wd => {
        ctx.strokeStyle = wd.color;
        ctx.shadowColor = wd.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let lx = 0; lx <= ow; lx += 4) {
          let relativeY = (oy + oh/2) + Math.sin(lx * wd.freq + elapsed * wd.speed + wd.phase) * wd.amp * Math.cos(lx * 0.004);
          if (lx === 0) ctx.moveTo(ox + lx, relativeY); else ctx.lineTo(ox + lx, relativeY);
        }
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#1e1a42"; // brand dark text
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.fillText(`FOCAL LOCK: ${Math.floor(92 + Math.sin(elapsed * 2) * 4)}%`, ox + 15, oy + 22);

      ctx.restore();
    }


    function drawMemoryGridPanel(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
      ctx.save();
      ctx.fillStyle = "#8A2BE2"; // brand purple
      ctx.font = "bold 13px 'Space Grotesk', system-ui";
      ctx.fillText("MNEMONIC CORE CAP STORAGE", -w/2 + 25, -h/2 + 35);
      ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("SECTOR RETENTION MATRIX MAP", -w/2 + 25, -h/2 + 48);

      const startX = -w/2 + 35;
      const startY = -h/2 + 75;
      const rows = 4;
      const cols = 5;
      const itemW = (w - 70) / cols - 6;
      const itemH = (h - 110) / rows - 6;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let idx = r * cols + c;
          let bx = startX + c * (itemW + 6);
          let by = startY + r * (itemH + 6);

          let hash = (idx * 17) % 7;
          let isActive = hash > 2;

          let pulse = Math.sin(elapsed * 1.5 + idx * 0.5) * 0.5 + 0.5;

          if (isActive) {
            let grad = ctx.createLinearGradient(bx, by, bx + itemW, by + itemH);
            grad.addColorStop(0, hexToRGBA("#a78bfa", 0.05 + pulse * 0.1)); // brand violet
            grad.addColorStop(1, hexToRGBA("#8A2BE2", 0.15 + pulse * 0.2)); // brand purple
            ctx.fillStyle = grad;
            ctx.strokeStyle = hexToRGBA("#8A2BE2", 0.4 + pulse * 0.35); // brand purple
            ctx.lineWidth = 1.5;
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
            ctx.strokeStyle = "rgba(179, 165, 226, 0.2)";
            ctx.lineWidth = 1;
          }

          ctx.beginPath();
          ctx.roundRect(bx, by, itemW, itemH, 6);
          ctx.fill();
          ctx.stroke();

          if (isActive && itemW > 35) {
            ctx.fillStyle = "#4a456e"; // brand secondary text
            ctx.font = "bold 8px 'JetBrains Mono', monospace";
            ctx.fillText(`M${idx.toString().padStart(2, '0')}`, bx + 6, by + 16);
          }
        }
      }

      ctx.restore();
    }


    function drawChronotypeSunPanel(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
      ctx.save();
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 13px 'Space Grotesk', system-ui";
      ctx.fillText("CIRCADIAN ENERGY PEAK ALIGN", -w/2 + 25, -h/2 + 35);
      ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("BIOLOGICAL INTEGRATION DIALS", -w/2 + 25, -h/2 + 48);

      const startX = -w/2 + 30;
      const startY = h/2 - 80;
      const width = w - 60;

      ctx.strokeStyle = "rgba(179, 165, 226, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + width, startY);
      ctx.stroke();

      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, startY - 10, 80, Math.PI, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = "rgba(16, 185, 129, 0.55)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let x = 0; x <= width; x += 5) {
        let relativeX = x / width;
        let yVal = startY - Math.sin(relativeX * Math.PI) * 90;
        ctx.lineTo(startX + x, yVal);
      }
      ctx.stroke();

      let sunPercent = (0.35 + Math.sin(elapsed * 0.15) * 0.15);
      let sunX = startX + width * sunPercent;
      let sunY = startY - Math.sin(sunPercent * Math.PI) * 90;

      ctx.fillStyle = "#10b981";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        let rayAngle = (i * Math.PI / 4) + elapsed * 0.4;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(rayAngle) * 11, sunY + Math.sin(rayAngle) * 11);
        ctx.lineTo(sunX + Math.cos(rayAngle) * 15, sunY + Math.sin(rayAngle) * 15);
        ctx.stroke();
      }

      let centerLabelX = startX + width * 0.5;
      ctx.fillStyle = "#1e1a42"; // brand deep text
      ctx.font = "bold 9px 'Space Grotesk', system-ui";
      ctx.fillText("PEAK COGNITIVE HORIZON", centerLabelX - 55, startY - 110);
      
      ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand secondary text
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("09:00 - 13:00 // 98% ALIGNED", centerLabelX - 55, startY - 98);

      ctx.restore();
    }


    // --- HIGH-DENSITY INTERLOCKING GLASS SYSTEM ---
    class GlassPanel {
      x: number;
      y: number;
      w: number;
      h: number;
      rotation: number;
      parallaxFactor: number;
      mixColorIndex: number;
      contentType: 'none' | 'brain' | 'report-card' | 'cognitive-chart' | 'focus-wave' | 'memory-grid' | 'chronotype-sun';

      constructor(
        x: number, 
        y: number, 
        w: number, 
        h: number, 
        rotation: number, 
        parallaxFactor: number, 
        mixColorIndex = 0,
        contentType: 'none' | 'brain' | 'report-card' | 'cognitive-chart' | 'focus-wave' | 'memory-grid' | 'chronotype-sun' = 'none'
      ) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.rotation = rotation * Math.PI / 180;
        this.parallaxFactor = parallaxFactor;
        this.mixColorIndex = mixColorIndex; // Alternates tints for premium varied stack color play
        this.contentType = contentType;
      }
      draw(elapsed: number) {
        if (!ctx) return;
        let dx = (mouse.x - V_WIDTH / 2) * this.parallaxFactor;
        let dy = (mouse.y - V_HEIGHT / 2) * this.parallaxFactor;
        
        // Dynamic complex multi-phase floating algorithm
        let floatOffset = Math.sin(elapsed * 0.6 + this.x * 0.01) * 12 + Math.cos(elapsed * 0.4 + this.y * 0.01) * 6;

        ctx.save();
        ctx.translate(this.x + dx, this.y + dy + floatOffset);
        ctx.rotate(this.rotation);

        // High-performance clean drop shadow
        ctx.shadowColor = "rgba(138, 43, 226, 0.14)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 12;

        let glassGrad = ctx.createLinearGradient(-this.w/2, -this.h/2, this.w/2, this.h/2);
        if (this.mixColorIndex === 0) {
          // Purple glass variant blend using CogTwin brand values (Light theme frosted)
          glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
          glassGrad.addColorStop(0.5, "rgba(244, 242, 250, 0.82)");
          glassGrad.addColorStop(1, "rgba(226, 222, 242, 0.65)");
        } else if (this.mixColorIndex === 1) {
          // Violet/blue glass variant blend (Light theme frosted)
          glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.88)");
          glassGrad.addColorStop(0.5, "rgba(240, 244, 255, 0.85)");
          glassGrad.addColorStop(1, "rgba(215, 225, 255, 0.6)");
        } else {
          // Deep blue variant blend (Light theme frosted)
          glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.88)");
          glassGrad.addColorStop(0.5, "rgba(245, 242, 255, 0.85)");
          glassGrad.addColorStop(1, "rgba(225, 215, 255, 0.65)");
        }
        ctx.fillStyle = glassGrad;

        ctx.beginPath();
        ctx.roundRect(-this.w/2, -this.h/2, this.w, this.h, 24);
        ctx.fill();

        ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

        // Premium multi-stop iridescent edge border mapping
        let borderGrad = ctx.createLinearGradient(-this.w/2, -this.h/2, this.w/2, this.h/2);
        borderGrad.addColorStop(0, "rgba(138, 43, 226, 0.35)");   // brand purple
        borderGrad.addColorStop(0.25, "rgba(167, 139, 250, 0.2)"); // brand violet
        borderGrad.addColorStop(0.50, "rgba(0, 174, 239, 0.3)");   // brand blue
        borderGrad.addColorStop(0.75, "rgba(16, 185, 129, 0.15)"); // brand emerald
        borderGrad.addColorStop(1, "rgba(138, 43, 226, 0.3)");   // brand purple back
        
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 2.5;
        ctx.stroke();


        // Render themed content inside the rotated coordinate matrix
        if (this.contentType === 'brain') {
          drawBrainPanel(ctx, this.w, this.h, elapsed);
        } else if (this.contentType === 'report-card') {
          drawReportCardPanel(ctx, this.w, this.h, elapsed);
        } else if (this.contentType === 'cognitive-chart') {
          drawCognitiveChartPanel(ctx, this.w, this.h, elapsed);
        } else if (this.contentType === 'focus-wave') {
          drawFocusWavePanel(ctx, this.w, this.h, elapsed);
        } else if (this.contentType === 'memory-grid') {
          drawMemoryGridPanel(ctx, this.w, this.h, elapsed);
        } else if (this.contentType === 'chronotype-sun') {
          drawChronotypeSunPanel(ctx, this.w, this.h, elapsed);
        }

        ctx.restore();
      }
    }

    // MASSIVE 10-PIECE CLUSTER INTERLOCKING ARCHITECTURE BLOCK MAP
    const backgroundPanels = [
      // Background Foundation Layer with specific diagnostic content mappings
      new GlassPanel(280, 250, 360, 480, -10, 0.03, 0, 'report-card'),
      new GlassPanel(640, 200, 420, 320, 6, 0.025, 2, 'cognitive-chart'),
      new GlassPanel(1650, 260, 350, 500, -15, 0.04, 1, 'memory-grid'),
      new GlassPanel(1240, 300, 390, 450, 12, 0.035, 0, 'brain'),
      
      // Mid-tier Interlocking Overlaps
      new GlassPanel(960, 480, 580, 640, -4, 0.02, 0, 'none'), // Giant Anchor center plate left clean for text reveal
      new GlassPanel(450, 720, 520, 400, 18, 0.045, 1, 'focus-wave'),
      new GlassPanel(1460, 750, 480, 380, -8, 0.035, 2, 'chronotype-sun'),
      
      // Foreground Floating Tech Fragments (Creates rich dimensional complexity)
      new GlassPanel(150, 920, 280, 280, 25, 0.06, 0, 'none'),
      new GlassPanel(800, 960, 440, 250, -12, 0.05, 1, 'none'),
      new GlassPanel(1800, 980, 320, 340, 15, 0.055, 2, 'none')
    ];

    // --- FAIRY DUST SPARKLE MATRIX ---
    class Sparkle {
      isBackground: boolean;
      x = 0;
      y = 0;
      size = 1;
      alpha = 1;
      vx = 0;
      vy = 0;
      life = 0;
      maxLife = 0;
      color = "rgba(255,255,255,1)";

      constructor(isBackground = false) {
        this.isBackground = isBackground;
        this.reset();
        if (this.isBackground) {
          this.x = Math.random() * V_WIDTH; this.y = Math.random() * V_HEIGHT;
        }
      }
      reset() {
        this.x = 0; this.y = 0;
        this.size = Math.random() * (this.isBackground ? 2 : 4) + 0.5;
        this.alpha = this.isBackground ? Math.random() * 0.4 + 0.1 : 1;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 - (this.isBackground ? 0.2 : 0.5);
        this.life = Math.random() * 40 + 20; this.maxLife = this.life;
      }
      emit(x: number, y: number, color: string) {
        this.x = x; this.y = y; this.color = color; this.alpha = 1;
        this.life = Math.random() * 50 + 25; this.maxLife = this.life;
        this.vx = (Math.random() - 0.5) * 5 + (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 5;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (!this.isBackground) {
          this.vy += 0.007;
          this.vx += Math.sin(Date.now() * 0.005 + this.x) * 0.025;
          this.life--; this.alpha = Math.max(0, this.life / this.maxLife);
        } else {
          this.alpha = 0.2 + Math.sin(Date.now() * 0.001 + this.x) * 0.15;
          if (this.y < -10) this.y = V_HEIGHT + 10;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.isBackground ? "rgba(167, 139, 250, 0.35)" : this.color; // brand violet background stars
        
        ctx.beginPath();
        if (!this.isBackground && this.size > 2.5) {
          // Highly optimized, clean star crosses - avoiding expensive canvas shadowBlur filter stalls
          ctx.fillRect(this.x - this.size * 1.5, this.y - 0.5, this.size * 3, 1);
          ctx.fillRect(this.x - 0.5, this.y - this.size * 1.5, 1, this.size * 3);
        } else {
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }

    const ambientStars = Array.from({ length: 60 }, () => new Sparkle(true));
    const dynamicSparkles = Array.from({ length: 220 }, () => new Sparkle(false));
    let sparkleIndex = 0;

    function spawnSparkle(x: number, y: number, color: string) {
      dynamicSparkles[sparkleIndex].emit(x, y, color);
      sparkleIndex = (sparkleIndex + 1) % dynamicSparkles.length;
    }

    // --- LIGHT THREAD TRAIL GENERATORS ---
    class FluidThread {
      color: string;
      history: { x: number; y: number }[] = [];
      maxHistory = 30; // Shorter trail for snappier performance

      constructor(color: string) {
        this.color = color;
      }
      update(x: number, y: number) {
        this.history.push({ x, y });
        if (this.history.length > this.maxHistory) this.history.shift();
        spawnSparkle(x, y, this.color);
        if (Math.random() > 0.4) spawnSparkle(x, y, this.color);
      }
      draw() {
        if (this.history.length < 2 || !ctx) return;
        ctx.save();
        
        // Build the drawing line buffer once instead of looping step stroke commands
        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // PASS 1: Thick glow halo backdrop
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 18;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.35;
        ctx.stroke();

        // PASS 2: Super crisp high-tint inner core
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9;
        ctx.stroke();

        ctx.restore();
      }
      clear() { this.history = []; }
    }

    const whiteThreads = [new FluidThread('#ffffff'), new FluidThread('#e0f2fe'), new FluidThread('#bae6fd')];
    const pinkThreads = [new FluidThread('#a78bfa'), new FluidThread('#c4b5fd'), new FluidThread('#ddd6fe')]; // brand violet/lavender threads
    const purpleThreads = [new FluidThread('#8A2BE2'), new FluidThread('#a78bfa'), new FluidThread('#c4b5fd'), new FluidThread('#00AEEF')]; // brand purple/blue threads

    function drawAnamorphicFlare(x: number, y: number, color: string) {
      if (!ctx) return;
      ctx.save();
      // On light-mode, use regular source-over blending to allow highly refined, elegant, glossy lens flare rendering
      let flareGrad = ctx.createRadialGradient(x, y, 0, x, y, 40);
      flareGrad.addColorStop(0, "#ffffff"); flareGrad.addColorStop(0.2, color); flareGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = flareGrad;
      ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2); ctx.fill();

      let lineGrad = ctx.createLinearGradient(x - 300, y, x + 300, y);
      lineGrad.addColorStop(0, "rgba(255,255,255,0)"); lineGrad.addColorStop(0.5, "rgba(255,255,255,0.85)"); lineGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = lineGrad; ctx.fillRect(x - 300, y - 1, 600, 2);
      ctx.restore();
    }


    let startTime = Date.now();

    function render() {
      if (isCancelled || !ctx || !canvas) return;

      let elapsed = ((Date.now() - startTime) / 1000) % 13;
      
      let scale = Math.min(canvas.width / V_WIDTH, canvas.height / V_HEIGHT);
      let offsetX = (canvas.width - V_WIDTH * scale) / 2;
      let offsetY = (canvas.height - V_HEIGHT * scale) / 2;

      // Base background gradient matching CogTwin brand exactly (editorial light lavender/lilac canvas)
      let bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGrad.addColorStop(0, "#f4f2fa");
      bgGrad.addColorStop(0.5, "#ebe8f6");
      bgGrad.addColorStop(1, "#e2def2");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      drawCinematicGrid(elapsed);
      ambientBeams.forEach(beam => { beam.update(); beam.draw(); });

      let fluidPulse = Math.sin(elapsed * 1.5) * 0.04;
      let aura = ctx.createRadialGradient(V_WIDTH/2, V_HEIGHT/2, 50, V_WIDTH/2, V_HEIGHT/2, V_WIDTH);
      aura.addColorStop(0, `rgba(138, 43, 226, ${0.12 + fluidPulse})`); // brand purple glowing source
      aura.addColorStop(0.6, `rgba(235, 232, 246, 0.25)`);
      aura.addColorStop(1, "rgba(226, 222, 242, 0.45)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);


      ambientStars.forEach(star => { star.update(); star.draw(); });
      
      // Draw our completely upgraded layout array matrix
      backgroundPanels.forEach(panel => panel.draw(elapsed));

      // ==========================================
      // STAGE 1: White Threads -> SWIRLING TRAJECTORY
      // ==========================================
      if (elapsed >= 0 && elapsed < 3.5) {
        setIntroStep(0);
        let t = elapsed / 3.5;
        let ease = easeInOutQuint(t);

        let headX = -50 + (V_WIDTH + 100) * ease;
        let swirlOffset = Math.sin(t * Math.PI * 4.5) * 160; 
        let headY = 450 + Math.cos(t * Math.PI * 1.5) * 180 + swirlOffset;

        whiteThreads.forEach((th, i) => {
          let spaceModX = Math.sin(elapsed * 8 + i) * 15 * (1 - ease);
          let spaceModY = Math.cos(elapsed * 8 + i) * 15 * (1 - ease);
          th.update(headX + spaceModX, headY + spaceModY + (i * 4));
          th.draw();
        });

        drawAnamorphicFlare(headX, headY, "rgba(167, 139, 250, 0.6)"); // brand violet

        if (t > 0.1) {
          let chartProgress = Math.min((t - 0.1) / 0.6, 1);
          let alpha = t > 0.88 ? (1 - t) / 0.12 : 1;
          drawCognitiveCore(V_WIDTH / 2, V_HEIGHT / 2 - 35, 340, chartProgress, alpha, elapsed, true);
        }
        pinkThreads.forEach(th => th.clear());
        purpleThreads.forEach(th => th.clear());
      }

      // ==========================================
      // STAGE 2: Pink Threads -> WHIMSICAL CORKSCREW
      // ==========================================
      if (elapsed >= 3.5 && elapsed < 7) {
        setIntroStep(1);
        let localTime = elapsed - 3.5;
        let t = localTime / 3.5;
        let ease = easeInOutQuint(t);

        let headX = -50 + (V_WIDTH + 100) * ease;
        let swirlOffset = Math.cos(t * Math.PI * 5) * 180;
        let headY = 550 + Math.sin(t * Math.PI * 2) * -120 + swirlOffset;

        pinkThreads.forEach((th, i) => {
          let spaceModX = Math.cos(elapsed * 9 + i) * 18 * (1 - ease);
          let spaceModY = Math.sin(elapsed * 9 + i) * 18 * (1 - ease);
          th.update(headX + spaceModX, headY + spaceModY + (i * 4));
          th.draw();
        });

        drawAnamorphicFlare(headX, headY, "rgba(0, 174, 239, 0.6)"); // brand blue

        if (t > 0.1) {
          let alpha = t > 0.88 ? (1 - t) / 0.12 : 1;
          drawCognitiveCore(V_WIDTH / 2, V_HEIGHT / 2 - 35, 340, 1.0, alpha, elapsed, true);
        }
        whiteThreads.forEach(th => th.clear());
        purpleThreads.forEach(th => th.clear());
      }

      // ==========================================
      // STAGE 3: Brand Text Reveal + Symbolic Analytical Widgets
      // ==========================================
      if (elapsed >= 7) {
        setIntroStep(2);
        let localTime = elapsed - 7;
        let t = localTime / 6; 
        
        let introTime = Math.min(t / 0.3, 1);
        let easeIntro = easeInOutQuint(introTime);
        let floatY = Math.sin(elapsed * 1.5) * 10;

        purpleThreads.forEach((th, i) => {
          let headX, headY;
          let targets = [
            {x: V_WIDTH / 2 - 450, y: V_HEIGHT / 2 - 180 + floatY},
            {x: V_WIDTH / 2 + 450, y: V_HEIGHT / 2 - 180 + floatY},
            {x: V_WIDTH / 2 - 450, y: V_HEIGHT / 2 + 180 + floatY},
            {x: V_WIDTH / 2 + 450, y: V_HEIGHT / 2 + 180 + floatY}
          ];

          if (introTime < 1) {
            let radius = 850 * (1 - easeIntro);
            let angle = easeIntro * Math.PI * 3.5 + (i * Math.PI / 2);
            headX = V_WIDTH / 2 + Math.cos(angle) * radius;
            headY = V_HEIGHT / 2 + Math.sin(angle) * radius;
          } else {
            let timeMod = elapsed * 2 + i * Math.PI;
            let orbitX = Math.sin(timeMod) * 105;
            let orbitY = Math.sin(timeMod * 2) * 55;
            headX = targets[i].x + orbitX;
            headY = targets[i].y + orbitY;
          }

          th.update(headX, headY);
          th.draw();
        });

        let contentAlpha = Math.min(localTime / 1.2, 1);
        if (t > 0.9) contentAlpha = (1 - t) / 0.1;

        if (localTime > 0.3) {
          // Draw the background rotating cognitive core with lower opacity
          drawCognitiveCore(V_WIDTH / 2, V_HEIGHT / 2 + floatY - 25, 380, 1.0, contentAlpha * 0.35, elapsed * 0.65, false);

          ctx.save();
          ctx.globalAlpha = contentAlpha;

          // Align text to fit "Cognitive Twin" or "AnalystOS"
          ctx.font = "900 110px 'Space Grotesk', 'Montserrat', 'Segoe UI', sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.letterSpacing = "15px";

          ctx.shadowColor = "rgba(138, 43, 226, 0.3)"; // brand purple glow under text
          ctx.shadowBlur = 35;
          ctx.fillStyle = "#1e1a42"; // brand dark purple primary text color
          ctx.fillText("Cognitive Twin", V_WIDTH / 2, V_HEIGHT / 2 + floatY);
          
          ctx.shadowBlur = 0;
          ctx.restore();

          drawWidgetNode(V_WIDTH / 2 - 450, V_HEIGHT / 2 - 180 + floatY, 'identity-blueprint', elapsed);
          drawWidgetNode(V_WIDTH / 2 + 450, V_HEIGHT / 2 - 180 + floatY, 'circadian-loop', elapsed);
          drawWidgetNode(V_WIDTH / 2 - 450, V_HEIGHT / 2 + 180 + floatY, 'neural-synapses', elapsed);
          drawWidgetNode(V_WIDTH / 2 + 450, V_HEIGHT / 2 + 180 + floatY, 'roadmap-path', elapsed);
        }
        whiteThreads.forEach(th => th.clear());
        pinkThreads.forEach(th => th.clear());
      }

      dynamicSparkles.forEach(spark => {
        if (spark.life > 0) {
          spark.update();
          spark.draw();
        }
      });

      let vignette = ctx.createRadialGradient(V_WIDTH/2, V_HEIGHT/2, V_WIDTH * 0.4, V_WIDTH/2, V_HEIGHT/2, V_WIDTH * 0.75);
      vignette.addColorStop(0, "rgba(255,255,255,0)"); vignette.addColorStop(1, "rgba(226, 222, 242, 0.45)"); // soft light lilac vignette
      ctx.fillStyle = vignette; ctx.fillRect(0,0, V_WIDTH, V_HEIGHT);


      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    }

    // --- INTERFACE UTILITIES MAPS ---
    function drawWidgetNode(cx: number, cy: number, type: string, elapsed: number) {
      if (!ctx) return;
      ctx.save();
      let size = 140;
      
      ctx.shadowColor = "rgba(138, 43, 226, 0.12)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 12;

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"; // brand light surface
      ctx.beginPath(); ctx.roundRect(cx - size/2, cy - size/2, size, size, 14); ctx.fill();

      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "rgba(138, 43, 226, 0.35)"; // brand purple border
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.shadowBlur = 12; ctx.shadowColor = "rgba(138, 43, 226, 0.25)";

      if (type === 'identity-blueprint') {
        ctx.save();
        ctx.translate(cx, cy);
        
        ctx.strokeStyle = "rgba(162, 82, 255, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#a78bfa"; // brand violet
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 36, elapsed * 1.2, elapsed * 1.2 + Math.PI * 0.65);
        ctx.stroke();

        ctx.strokeStyle = "#8A2BE2"; // brand purple
        ctx.beginPath();
        ctx.arc(0, 0, 24, -elapsed * 2, -elapsed * 2 + Math.PI * 0.9);
        ctx.stroke();

        ctx.fillStyle = "#1e1a42"; // brand dark text primary
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } 
      else if (type === 'circadian-loop') {
        ctx.save();
        ctx.translate(cx, cy);
        
        ctx.strokeStyle = "rgba(0, 174, 239, 0.2)"; // brand blue
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#00AEEF"; // brand blue active
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, 34, Math.sin(elapsed) * 0.2, Math.PI + Math.sin(elapsed) * 0.2);
        ctx.stroke();

        ctx.strokeStyle = "#a78bfa"; // brand violet
        ctx.beginPath();
        ctx.arc(0, 0, 34, Math.PI * 1.2, Math.PI * 1.6);
        ctx.stroke();

        ctx.fillStyle = "#1e1a42"; // brand dark text primary
        ctx.font = "bold 9px 'Space Grotesk', system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PEAK", 0, -2);
        ctx.font = "7px 'Space Grotesk', system-ui";
        ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
        ctx.fillText("STATE", 0, 8);

        ctx.restore();
      } 
      else if (type === 'neural-synapses') {
        ctx.save();
        ctx.translate(cx, cy);

        const nodes = [
          { x: -20, y: -15, color: "#8A2BE2" }, // brand purple
          { x: 22, y: -5, color: "#00AEEF" },   // brand blue
          { x: -5, y: 22, color: "#a78bfa" }    // brand violet
        ];

        ctx.strokeStyle = "rgba(179, 165, 226, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.closePath();
        ctx.stroke();

        nodes.forEach((node, idx) => {
          let floatOffset = Math.sin(elapsed * 2.5 + idx) * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y + floatOffset, 6, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = node.color;
          ctx.fill();
        });

        ctx.restore();
      } 
      else if (type === 'roadmap-path') {
        ctx.save();
        ctx.translate(cx, cy);

        ctx.strokeStyle = "rgba(179, 165, 226, 0.3)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-20, -35);
        ctx.lineTo(-20, 35);
        ctx.stroke();

        for (let i = 0; i < 3; i++) {
          let yVal = -22 + i * 22;
          let isPulse = (Math.floor(elapsed * 1.5) % 3) === i;

          ctx.strokeStyle = isPulse ? "#00AEEF" : "rgba(179, 165, 226, 0.3)";
          ctx.beginPath();
          ctx.moveTo(-20, yVal);
          ctx.lineTo(15, yVal);
          ctx.stroke();

          ctx.fillStyle = isPulse ? "#00AEEF" : "rgba(138, 43, 226, 0.35)";
          ctx.beginPath();
          ctx.arc(15, yVal, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = isPulse ? "#8A2BE2" : "rgba(179, 165, 226, 0.2)";
          ctx.fillRect(-23, yVal - 3, 6, 6);
        }

        ctx.restore();
      }
      ctx.restore();
    }


    function drawCognitiveCore(
      cx: number,
      cy: number,
      radius: number,
      progress: number,
      alpha: number,
      elapsed: number,
      showLabels = true
    ) {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = alpha;

      let r = radius * progress;

      // Concentric background radar grids
      ctx.strokeStyle = "rgba(138, 43, 226, 0.08)"; // brand purple grid
      ctx.lineWidth = 1;
      for (let d = 0.3; d <= 1.0; d += 0.22) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * d, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw two rotating outer rings with coordinates indicators
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(elapsed * 0.25);
      ctx.strokeStyle = "rgba(0, 174, 239, 0.2)"; // brand blue dash ring
      ctx.setLineDash([4, 25]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-elapsed * 0.15);
      ctx.strokeStyle = "rgba(167, 139, 250, 0.15)"; // brand violet dash ring
      ctx.setLineDash([12, 10, 2, 10]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw 4 Main Cognitive Poles:
      const poles = [
        { name: "EXEC FOCUS", dx: 0, dy: -r * 0.75, color: "#00AEEF" },       // brand blue
        { name: "RECALL STACK", dx: r * 0.75, dy: 0, color: "#a78bfa" },     // brand violet
        { name: "BIOCLOCK SYNC", dx: 0, dy: r * 0.75, color: "#10b981" },     // brand emerald
        { name: "LOGICAL RATIO", dx: -r * 0.75, dy: 0, color: "#8A2BE2" }     // brand purple
      ];

      // Draw connectivity field polygon
      ctx.fillStyle = "rgba(138, 43, 226, 0.05)"; // brand purple field
      ctx.beginPath();
      poles.forEach((p, idx) => {
        let mod = 1.0 + Math.sin(elapsed * 2.2 + idx) * 0.05;
        let px = cx + p.dx * mod;
        let py = cy + p.dy * mod;
        if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();

      // Connect poles with bright neon lines
      ctx.lineWidth = 1.5;
      poles.forEach((p1, idx1) => {
        poles.forEach((p2, idx2) => {
          if (idx1 < idx2) {
            let mod1 = 1.0 + Math.sin(elapsed * 2.2 + idx1) * 0.05;
            let mod2 = 1.0 + Math.sin(elapsed * 2.2 + idx2) * 0.05;
            let x1 = cx + p1.dx * mod1;
            let y1 = cy + p1.dy * mod1;
            let x2 = cx + p2.dx * mod2;
            let y2 = cy + p2.dy * mod2;

            let grad = ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0, p1.color);
            grad.addColorStop(1, p2.color);
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Traveling pulse particles
            let t = (elapsed * 0.4 + idx1 * 0.25) % 1.0;
            let pulseX = x1 + (x2 - x1) * t;
            let pulseY = y1 + (y2 - y1) * t;
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw the pole nodes
      poles.forEach((p, idx) => {
        let mod = 1.0 + Math.sin(elapsed * 2.2 + idx) * 0.05;
        let px = cx + p.dx * mod;
        let py = cy + p.dy * mod;

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        if (showLabels) {
          ctx.fillStyle = "#1e1a42"; // brand primary text
          ctx.font = "bold 9px 'Space Grotesk', system-ui";
          ctx.textAlign = "center";
          ctx.fillText(p.name, px, py + (p.dy < 0 ? -16 : 22));
        }
      });

      // Center vector brain silhouette drawing (Pulsating)
      ctx.save();
      ctx.translate(cx, cy);
      let pulseIntensity = 1.0 + Math.sin(elapsed * 3) * 0.08;
      ctx.scale(pulseIntensity * progress * 0.75, pulseIntensity * progress * 0.75);

      // Left side curves
      ctx.fillStyle = "rgba(0, 174, 239, 0.25)"; // brand blue override
      ctx.strokeStyle = "#00AEEF";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.bezierCurveTo(-20, -35, -35, -20, -35, -5);
      ctx.bezierCurveTo(-35, 10, -20, 25, -5, 30);
      ctx.bezierCurveTo(-2, 32, -1, 35, 0, 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right side curves
      ctx.fillStyle = "rgba(138, 43, 226, 0.25)"; // brand purple override
      ctx.strokeStyle = "#8A2BE2";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.bezierCurveTo(20, -35, 35, -20, 35, -5);
      ctx.bezierCurveTo(35, 10, 20, 25, 5, 30);
      ctx.bezierCurveTo(2, 32, 1, 35, 0, 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner complex pattern matrix circle
      ctx.strokeStyle = "rgba(179, 165, 226, 0.35)"; // brand border subtle grid
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -5, 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      if (showLabels) {
        ctx.fillStyle = "rgba(74, 69, 110, 0.65)"; // brand text secondary
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("COGNITIVE SYNC COMPLETE // RETINAL FEED READY", cx, cy + r * 0.82 + 30);
      }


      ctx.restore();
    }

    render();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#f4f2fa] z-[999999] overflow-hidden select-none transition-colors duration-1000">
      <canvas ref={canvasRef} className="block w-full h-full" id="cinemaStage" />
      
      {/* Floating high-end control tray */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-between w-full max-w-4xl px-8 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-violet-600 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h1 className="text-[#1e1a42] text-xs font-bold uppercase tracking-wider font-mono">Cognitive Lab Alpha</h1>
            <p className="text-[9px] text-[#4a456e]/80 font-mono uppercase tracking-widest">
              {introStep === 0 && "SYSTEM INITIALIZATION // RECONSTRUCTING SYNAPTIC PATHWAYS"}
              {introStep === 1 && "BIO-TEMPORAL CHRONOTYPE PROTOCOL CALIBRATION"}
              {introStep === 2 && "COGNITIVE SYNAPSE ALIGNMENT COMPLETE // CORE ONLINE"}
            </p>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="px-6 py-2.5 bg-[#8A2BE2] hover:bg-[#684cc8] text-white border border-[#8A2BE2]/20 hover:border-[#684cc8] text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#8A2BE2]/15 hover:shadow-[#8A2BE2]/30 active:scale-95"
        >
          <span>Enter Laboratory</span>
          <SkipForward className="w-3 h-3" />
        </button>
      </div>

      {/* Floating HUD status indicator in the bottom-right */}
      <div className="absolute bottom-8 right-8 z-50 font-mono text-[9px] text-[#4a456e]/60 uppercase tracking-widest text-right space-y-1">
        <p>PROJECT PROTOCOL ACTIVE</p>
        <p className="text-violet-600/80 font-bold">1920 X 1080 VIRTUAL SCREEN BUFFER</p>
        <p className="text-[#7c779e]">FPS REHYDRATED CAP 60HZ</p>
      </div>

      {/* Elegant fade out overlay */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f4f2fa] to-transparent pointer-events-none" />
    </div>
  );
}
