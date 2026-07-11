import { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  label: string;
  color: string;
}

export default function ThreeDSpace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Set canvas dimensions
    const resize = () => {
      if (containerRef.current) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight || 450;
        canvas.width = width;
        canvas.height = height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Nodes representing code constructs
    const labels = [
      'ptr *C++', 'def Python', 'const JS', 'useState()', 'SQL SELECT', 
      'Binary Search', 'Linked List', '<div> HTML', 'grid CSS', 'Node.js', 
      'Express', 'interface TS', 'class Java', 'Next.js', 'std::cout',
      'async/await', 'API Route', 'Docker', 'Git', 'Graph'
    ];

    const colors = [
      '#a855f7', '#c084fc', '#e9d5ff', '#cbd5e1', '#f472b6', '#38bdf8'
    ];

    // Generate 3D point positions on a sphere
    const points: Point3D[] = [];
    const numPoints = labels.length;
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      const radius = 160;

      points.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        label: labels[i],
        color: colors[i % colors.length]
      });
    }

    // Dynamic rotation speeds and angle states
    let angleX = 0.003;
    let angleY = 0.005;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x;
      mouseY = y;
      // Tilt speed based on mouse distance from center
      angleY = x * 0.00003;
      angleX = y * 0.00003;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Core 3D projection rendering loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      const fov = 350; // Camera field of view (focal length)

      // Trigonometric cache for efficiency
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Sorting points by depth (Z-axis) for proper painter's rendering
      points.forEach(p => {
        // Rotate around Y axis
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      });

      // Sort back-to-front
      const sortedPoints = [...points].sort((a, b) => b.z - a.z);

      // Draw connection background web lines
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < sortedPoints.length; i++) {
        for (let j = i + 1; j < sortedPoints.length; j++) {
          const distSq = 
            Math.pow(sortedPoints[i].x - sortedPoints[j].x, 2) +
            Math.pow(sortedPoints[i].y - sortedPoints[j].y, 2) +
            Math.pow(sortedPoints[i].z - sortedPoints[j].z, 2);
          
          if (distSq < 15000) { // Connect nodes in close 3D space
            const p1_scale = fov / (fov + sortedPoints[i].z);
            const p2_scale = fov / (fov + sortedPoints[j].z);
            
            ctx.beginPath();
            ctx.moveTo(cx + sortedPoints[i].x * p1_scale, cy + sortedPoints[i].y * p1_scale);
            ctx.lineTo(cx + sortedPoints[j].x * p2_scale, cy + sortedPoints[j].y * p2_scale);
            ctx.stroke();
          }
        }
      }

      // Render the nodes & labels
      let currentHovered: string | null = null;
      sortedPoints.forEach(p => {
        const scale = fov / (fov + p.z);
        const x2d = cx + p.x * scale;
        const y2d = cy + p.y * scale;

        // Depth-based transparency and size
        const opacity = Math.max(0.15, Math.min(1, (fov - p.z) / (fov * 1.5)));
        const size = Math.max(1, 4 * scale);

        // Check if mouse is near this projected node
        const mouseDist = Math.sqrt(Math.pow(mouseX + cx - x2d, 2) + Math.pow(mouseY + cy - y2d, 2));
        const isHovered = mouseDist < 25;
        if (isHovered) {
          currentHovered = p.label;
        }

        // Draw node dot
        ctx.fillStyle = isHovered ? '#c084fc' : p.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x2d, y2d, isHovered ? size * 2.2 : size, 0, 2 * Math.PI);
        ctx.fill();

        // Draw node text label
        ctx.font = isHovered ? 'bold 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : '10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
        ctx.fillStyle = isHovered ? '#ffffff' : '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, x2d, y2d - size - 6);
      });

      setHoveredNode(currentHovered);
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[380px] md:h-[450px] bg-black rounded-2xl border border-purple-950/40 overflow-hidden flex items-center justify-center">
      {/* Visual background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {/* High-tech overlay coordinates */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-purple-400 tracking-wider select-none">
        VOID_ENGINE_v2.5 // CORE_COORD: ACTIVE
      </div>
      
      <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" />

      {/* Dynamic educational hover feedback */}
      <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/80 backdrop-blur border border-purple-900/30 rounded-lg p-3 max-w-sm pointer-events-none transition-all duration-300">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            {hoveredNode ? "Linked Element Focused" : "3D Space Interactive"}
          </p>
        </div>
        <p className="font-sans text-xs text-white font-medium mt-1">
          {hoveredNode ? `Currently exploring "${hoveredNode}" curriculum and code challenges.` : "Drag cursor over the rotating code neural net to inspect programming nodes."}
        </p>
      </div>
    </div>
  );
}
