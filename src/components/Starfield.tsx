import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

export const Starfield = ({ theme = 'light' }: { theme?: 'light' | 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { 
      x: number; 
      y: number; 
      size: number; 
      vx: number; 
      vy: number; 
      opacity: number;
      baseX: number;
      baseY: number;
      density: number;
    }[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        density: (Math.random() * 30) + 1,
      });
    }

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const particleColor = theme === 'light' ? '0, 122, 255' : '10, 132, 255';
      
      particles.forEach(p => {
        // Floating motion
        p.x += p.vx;
        p.y += p.vy;

        // Boundary check
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 150;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * p.density;
        const directionY = forceDirectionY * force * p.density;

        if (distance < maxDistance) {
          p.x -= directionX;
          p.y -= directionY;
        } else {
          // Return to base position slowly
          if (p.x !== p.baseX) {
            const dx = p.x - p.baseX;
            p.x -= dx / 20;
          }
          if (p.y !== p.baseY) {
            const dy = p.y - p.baseY;
            p.y -= dy / 20;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn(
        "fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000",
        theme === 'light' ? "opacity-[0.15]" : "opacity-[0.25]"
      )}
    />
  );
};
