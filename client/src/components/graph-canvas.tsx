import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { DataEntry, Force } from "@/lib/physics-types";

interface GraphCanvasProps {
  template: 'cartesian' | 'inclined';
  dataEntries: DataEntry[];
  forces: Force[];
}

export function GraphCanvas({ template, dataEntries, forces }: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetView = () => {
    setZoomLevel(1);
  };

  const renderCartesianPlane = () => {
    const centerX = 400;
    const centerY = 300;
    
    return (
      <g>
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Main Axes */}
        <line x1={centerX} y1="0" x2={centerX} y2="600" stroke="#6b7280" strokeWidth="2"/>
        <line x1="0" y1={centerY} x2="800" y2={centerY} stroke="#6b7280" strokeWidth="2"/>
        
        {/* Axis Labels */}
        <text x="785" y="295" fill="#9ca3af" fontSize="14" textAnchor="end">x</text>
        <text x="405" y="15" fill="#9ca3af" fontSize="14">y</text>
        
        {/* Grid Numbers */}
        <g fill="#6b7280" fontSize="12" textAnchor="middle">
          {Array.from({ length: 21 }, (_, i) => i - 10).map(num => (
            <g key={num}>
              {num !== 0 && (
                <>
                  <text x={centerX + num * 40} y={centerY + 15}>{num}</text>
                  <text x={centerX - 15} y={centerY - num * 40 + 5}>{num}</text>
                </>
              )}
            </g>
          ))}
        </g>
        
        {/* Object/Body */}
        <rect 
          x={centerX - 15} 
          y={centerY - 15} 
          width="30" 
          height="30" 
          fill="#a855f7" 
          stroke="#ffffff" 
          strokeWidth="2" 
          rx="3"
        />
      </g>
    );
  };

  const renderInclinedPlane = () => {
    const centerX = 400;
    const centerY = 300;
    const angle = 30; // Default incline angle
    
    return (
      <g>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Coordinate system */}
        <line x1={centerX} y1="0" x2={centerX} y2="600" stroke="#6b7280" strokeWidth="2"/>
        <line x1="0" y1={centerY} x2="800" y2={centerY} stroke="#6b7280" strokeWidth="2"/>
        
        {/* Inclined plane */}
        <line 
          x1="200" 
          y1="450" 
          x2="600" 
          y2="250" 
          stroke="#4f46e5" 
          strokeWidth="4"
        />
        
        {/* Ground */}
        <line x1="0" y1="450" x2="800" y2="450" stroke="#4f46e5" strokeWidth="2"/>
        
        {/* Object on incline */}
        <rect 
          x="385" 
          y="335" 
          width="30" 
          height="30" 
          fill="#a855f7" 
          stroke="#ffffff" 
          strokeWidth="2" 
          rx="3"
          transform={`rotate(${-angle} 400 350)`}
        />
        
        {/* Angle arc */}
        <path
          d="M 600 250 A 30 30 0 0 0 580 280"
          fill="none"
          stroke="#f39c12"
          strokeWidth="2"
        />
        <text x="575" y="275" fill="#f39c12" fontSize="12">θ</text>
      </g>
    );
  };

  const renderForces = () => {
    const centerX = 400;
    const centerY = template === 'inclined' ? 350 : 300;
    
    return (
      <g>
        {forces.map(force => {
          const scale = 2;
          const radians = (force.direction * Math.PI) / 180;
          const length = force.value * scale;
          const endX = centerX + Math.cos(radians) * length;
          const endY = centerY - Math.sin(radians) * length;
          
          return (
            <g key={force.id}>
              {/* Arrow line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke={force.color}
                strokeWidth="3"
                markerEnd={`url(#arrowhead-${force.id})`}
              />
              
              {/* Force label */}
              <text
                x={endX + 10}
                y={endY - 5}
                fill={force.color}
                fontSize="12"
                fontWeight="500"
              >
                {force.name}
              </text>
              
              {/* Arrowhead marker */}
              <defs>
                <marker
                  id={`arrowhead-${force.id}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill={force.color} />
                </marker>
              </defs>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Graph Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="font-semibold text-white">
          {template === 'cartesian' ? 'Piano Cartesiano Libero' : 'Piano Inclinato'}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleZoomOut}
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-400 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            onClick={handleZoomIn}
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleResetView}
            size="sm"
            variant="outline"
            className="ml-2 px-3 py-1 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Graph Container */}
      <div className="flex-1 p-4">
        <motion.div 
          className="w-full h-full bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden"
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {template === 'cartesian' ? renderCartesianPlane() : renderInclinedPlane()}
            {renderForces()}
          </svg>
        </motion.div>
      </div>

      {/* Force Legend */}
      <div className="p-4 border-t border-slate-700">
        <h4 className="text-sm font-medium mb-2 text-white">Legenda Forze</h4>
        <div className="flex flex-wrap gap-3">
          {forces.length === 0 ? (
            <p className="text-slate-400 text-sm">Nessuna forza definita</p>
          ) : (
            forces.map(force => (
              <motion.div
                key={force.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: force.color }}
                />
                <span className="text-white">{force.name} ({force.value}N)</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
