"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock chart data points
const generateChartPoints = () => {
  const points = [];
  const baseY = 60;
  for (let i = 0; i < 100; i++) {
    const x = (i / 99) * 100;
    const y = baseY + Math.sin(i * 0.1) * 15 + Math.random() * 10 - 5;
    points.push(`${x},${Math.max(10, Math.min(90, y))}`);
  }
  return points.join(' ');
};

const chartData = {
  "3months": generateChartPoints(),
  "30days": generateChartPoints(),
  "7days": generateChartPoints()
};

export default function PerformanceChart() {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Total Visitors</h3>
          <p className="text-sm text-slate-500">Total for the last 3 months</p>
        </div>
        <Tabs defaultValue="3months" className="w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="3months" className="text-xs">Last 3 months</TabsTrigger>
            <TabsTrigger value="30days" className="text-xs">Last 30 days</TabsTrigger>
            <TabsTrigger value="7days" className="text-xs">Last 7 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="h-64 w-full">
        <Tabs defaultValue="3months" className="w-full h-full">
          {Object.entries(chartData).map(([period, points]) => (
            <TabsContent key={period} value={period} className="w-full h-full mt-0">
              <div className="w-full h-full relative">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                  
                  {/* Chart area fill */}
                  <path
                    d={`M 0,100 L ${points} L 100,100 Z`}
                    fill="url(#gradient)"
                    opacity="0.3"
                  />
                  
                  {/* Chart line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="0.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#64748b" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#64748b" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 px-2">
                  <span>Apr 8</span>
                  <span>Apr 15</span>
                  <span>Apr 24</span>
                  <span>May 5</span>
                  <span>May 15</span>
                  <span>May 24</span>
                  <span>Jun 5</span>
                  <span>Jun 17</span>
                  <span>Jun 30</span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
}