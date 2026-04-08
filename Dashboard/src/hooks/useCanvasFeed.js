/* ================================================================
   useCanvasFeed
   Renders animated terrain drone camera feed on an HTML5 Canvas.
   scene: 1 = valley road | 2 = open terrain | 3 = mountain pass
   ================================================================ */
import { useEffect, useRef } from "react";

export function useCanvasFeed(canvasRef, scene = 1) {
  const frameRef = useRef(0);
  const noiseRef = useRef(0);
  const rafRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const p = canvas.parentElement;
      if (p) { canvas.width = p.offsetWidth; canvas.height = p.offsetHeight; }
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      frameRef.current++;
      noiseRef.current += 0.007;
      const fr = frameRef.current;
      const nt = noiseRef.current;
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { rafRef.current = requestAnimationFrame(draw); return; }

      // Sky
      ctx.fillStyle = "#020810";
      ctx.fillRect(0, 0, W, H);
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
      sky.addColorStop(0, "#040c1e");
      sky.addColorStop(1, "#071428");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H * 0.55);

      // Mountain silhouettes per scene
      const mo = Math.sin(nt * 0.3) * 6;
      const mountainConfigs = {
        1: [0, .3, .12, .44, .25, .22, .38, .36, .52, .2, .65, .33, .78, .26, .9, .4],
        2: [0, .38, .15, .28, .3, .46, .45, .26, .6, .4, .75, .3, 1, .44],
        3: [0, .35, .2, .25, .4, .44, .55, .23, .7, .36, .85, .28, 1, .42],
      };
      const pts = mountainConfigs[scene] || mountainConfigs[1];
      ctx.fillStyle = scene === 3 ? "#0c2040" : scene === 2 ? "#091a30" : "#0a1e3a";
      ctx.beginPath();
      ctx.moveTo(0, H * 0.55 + mo);
      for (let i = 0; i < pts.length; i += 2) {
        ctx.lineTo(W * pts[i], H * pts[i + 1] + mo);
      }
      ctx.lineTo(W, H * 0.55 + mo);
      ctx.closePath();
      ctx.fill();

      // Snow caps
      ctx.fillStyle = "rgba(180,210,255,0.07)";
      const peaks = scene === 1
        ? [[.25, .25, .27, .22, .29, .25], [.62, .22, .65, .2, .68, .22]]
        : [[.38, .28, .4, .25, .42, .28], [.68, .25, .7, .22, .72, .25]];
      peaks.forEach(([x1,y1,x2,y2,x3,y3]) => {
        ctx.beginPath();
        ctx.moveTo(W*x1, H*y1+mo);
        ctx.lineTo(W*x2, H*y2+mo);
        ctx.lineTo(W*x3, H*y3+mo);
        ctx.closePath();
        ctx.fill();
      });

      // Ground
      const grd = ctx.createLinearGradient(0, H * 0.55, 0, H);
      grd.addColorStop(0,   "#0d1e35");
      grd.addColorStop(0.5, "#091628");
      grd.addColorStop(1,   "#060e1e");
      ctx.fillStyle = grd;
      ctx.fillRect(0, H * 0.52, W, H);

      // Road (scene 1 only)
      if (scene === 1) {
        ctx.strokeStyle = "rgba(74,120,180,0.12)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(W * 0.42, H);
        ctx.quadraticCurveTo(W * 0.48, H * 0.76, W * 0.55, H * 0.62);
        ctx.stroke();
      }

      // Camera shake
      const sx = Math.sin(fr * 0.06) * 0.4;
      const sy = Math.cos(fr * 0.1)  * 0.4;
      ctx.save();
      ctx.translate(sx, sy);

      // Vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.75);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Film grain
      if (fr % 2 === 0) {
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.025})`;
          ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
        }
      }
      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef, scene]);
}
