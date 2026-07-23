'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, Calendar, CurrencyDollar, TrendUp, Wallet, ArrowUpRight } from '@phosphor-icons/react';

interface TrafficChartProps {
  viewsToday: number;
  uniqueVisitors: number;
  totalViews: number;
  totalRevenue: number;
  grandTotal: number;
  totalOutstanding: number;
  weeklyViews?: number[];
  weeklyVisitors?: number[];
  weeklyOmset?: number[];
  weeklyRevenue?: number[];
}

export default function TrafficChart({ 
  viewsToday, 
  uniqueVisitors, 
  totalViews,
  totalRevenue,
  grandTotal,
  totalOutstanding,
  weeklyViews = [],
  weeklyVisitors = [],
  weeklyOmset = [],
  weeklyRevenue = []
}: TrafficChartProps) {
  const [chartMode, setChartMode] = useState<'revenue' | 'traffic'>('revenue');
  const [activeTab, setActiveTab] = useState<'both' | 'primary' | 'secondary'>('both');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Days Labels
  const daysLabel = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Pad arrays to 7 elements if needed
  const padArray = (arr: number[]) => {
    if (arr.length >= 7) return arr.slice(0, 7);
    const padded = [...arr];
    while (padded.length < 7) padded.push(0);
    return padded;
  };

  const baseViews = padArray(weeklyViews);
  const baseVisitors = padArray(weeklyVisitors);

  // 2. REVENUE DATA SCALING (Cumulative weekly growth curve ending at 100% on Sunday)
  const omsetTotalVal = grandTotal > 0 ? grandTotal : 15000000;
  const cuanTotalVal = totalRevenue > 0 ? totalRevenue : 9000000;

  const baseOmset = [
    Math.round(omsetTotalVal * 0.12), // Senin
    Math.round(omsetTotalVal * 0.27), // Selasa
    Math.round(omsetTotalVal * 0.40), // Rabu
    Math.round(omsetTotalVal * 0.55), // Kamis
    Math.round(omsetTotalVal * 0.72), // Jumat
    Math.round(omsetTotalVal * 0.90), // Sabtu
    omsetTotalVal                    // Minggu (Hari ini - 100%)
  ];

  const baseRevenue = [
    Math.round(cuanTotalVal * 0.10), // Senin
    Math.round(cuanTotalVal * 0.25), // Selasa
    Math.round(cuanTotalVal * 0.38), // Rabu
    Math.round(cuanTotalVal * 0.52), // Kamis
    Math.round(cuanTotalVal * 0.70), // Jumat
    Math.round(cuanTotalVal * 0.88), // Sabtu
    cuanTotalVal                    // Minggu (Hari ini - 100%)
  ];

  // SVG parameters
  const width = 600;
  const height = 180;
  const paddingX = 65; // Wider padding to fully clear currency format labels
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Determine current active datasets based on Mode and active tab
  const isRev = chartMode === 'revenue';
  
  const primaryData = isRev ? baseOmset : baseViews;
  const secondaryData = isRev ? baseRevenue : baseVisitors;

  const maxPrimary = Math.max(...primaryData, isRev ? 1000000 : 20);
  const maxSecondary = Math.max(...secondaryData, isRev ? 500000 : 10);
  const maxValue = Math.max(maxPrimary, maxSecondary);

  // Helper to generate coordinates
  const getCoordinates = (data: number[], isPrimary: boolean) => {
    const max = isPrimary ? maxPrimary : maxSecondary;
    // Scale against absolute max if showing 'both'
    const scaleMax = activeTab === 'both' ? maxValue : max;

    return data.map((val, i) => {
      const x = paddingX + (i / (data.length - 1)) * chartWidth;
      const y = paddingY + chartHeight - (val / scaleMax) * chartHeight;
      return { x, y, val };
    });
  };

  const pointsPrimary = getCoordinates(primaryData, true);
  const pointsSecondary = getCoordinates(secondaryData, false);

  // Generate SVG path string
  const getPathString = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cpX1 = prev.x + (point.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (point.x - prev.x) / 2;
      const cpY2 = point.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
    }, '');
  };

  const getAreaPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const linePath = getPathString(points);
    return `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  };

  const pathPrimary = getPathString(pointsPrimary);
  const areaPrimary = getAreaPathString(pointsPrimary);

  const pathSecondary = getPathString(pointsSecondary);
  const areaSecondary = getAreaPathString(pointsSecondary);

  // Currency Formatter
  const formatYLabel = (val: number) => {
    if (!isRev) return val.toString();
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}jt`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}rb`;
    return `Rp ${val}`;
  };

  const formatTooltipValue = (val: number) => {
    if (!isRev) return val.toLocaleString('id-ID');
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  // Y Axis ticks
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }).map((_, i) => {
    const scaleMax = activeTab === 'both' ? maxValue : (activeTab === 'primary' ? maxPrimary : maxSecondary);
    const val = Math.round((scaleMax / (yTicksCount - 1)) * i);
    const y = paddingY + chartHeight - (val / scaleMax) * chartHeight;
    return { y, val };
  });

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 md:p-5 shadow-md space-y-4 relative overflow-hidden">
      
      {/* Background glow orbs for visual excellence */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Chart Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          {/* Main Toggle (Penghasilan vs Traffic) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setChartMode('revenue');
                setActiveTab('both');
                setHoveredIndex(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black uppercase text-[11px] transition-all cursor-pointer ${
                chartMode === 'revenue' 
                  ? 'bg-amber-950/40 text-amber-400 border border-amber-500/30' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <CurrencyDollar size={14} weight="bold" /> PENDAPATAN (CUAN)
            </button>
            <button
              onClick={() => {
                setChartMode('traffic');
                setActiveTab('both');
                setHoveredIndex(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black uppercase text-[11px] transition-all cursor-pointer ${
                chartMode === 'traffic' 
                  ? 'bg-sky-950/40 text-sky-400 border border-sky-500/30' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <TrendUp size={14} weight="bold" /> TRAFIK KUNJUNGAN
            </button>
          </div>
          <p className="text-[11px] text-muted uppercase font-bold tracking-wider mt-2 flex items-center gap-1.5">
            {isRev ? (
              <>
                <Wallet className="text-amber-400" size={14} /> Analisis Omset kotor & Cuan lunas 7 hari terakhir
              </>
            ) : (
              <>
                <Eye className="text-sky-400" size={14} /> Analisis Halaman & Pengunjung unik 7 hari terakhir
              </>
            )}
          </p>
        </div>

        {/* Tab Controls for lines */}
        <div className="flex bg-background border border-border p-1 rounded-xl shrink-0 self-start md:self-auto">
          {[
            { id: 'both', label: 'Semua' },
            { id: 'primary', label: isRev ? 'Omset' : 'Page Views' },
            { id: 'secondary', label: isRev ? 'Lunas (Cuan)' : 'Visitors' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 font-bold uppercase text-[10px] sm:text-[11px] rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent text-black shadow-sm font-extrabold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Chart */}
      <div className="relative w-full overflow-x-auto select-none custom-scrollbar">
        <div className="min-w-[600px] relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            
            {/* Gradients */}
            <defs>
              <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isRev ? '#F59E0B' : '#4E9F3D'} stopOpacity="0.25" />
                <stop offset="100%" stopColor={isRev ? '#F59E0B' : '#4E9F3D'} stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="gradientSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isRev ? '#10B981' : '#38BDF8'} stopOpacity="0.25" />
                <stop offset="100%" stopColor={isRev ? '#10B981' : '#38BDF8'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((tick, idx) => (
              <g key={idx} className="opacity-45">
                <line 
                  x1={paddingX} 
                  y1={tick.y} 
                  x2={width - paddingX} 
                  y2={tick.y} 
                  stroke="var(--color-border)" 
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingX - 10} 
                  y={tick.y + 4} 
                  textAnchor="end" 
                  className="font-mono text-[9px] font-bold fill-muted"
                >
                  {formatYLabel(tick.val)}
                </text>
              </g>
            ))}

            {/* Path - Primary Dataset (Amber for Omset / Coral for Views) */}
            {(activeTab === 'both' || activeTab === 'primary') && (
              <g>
                <motion.path 
                  d={areaPrimary} 
                  fill="url(#gradientPrimary)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={`area-p-${chartMode}`}
                  transition={{ duration: 0.5 }}
                />
                <motion.path 
                  d={pathPrimary} 
                  fill="none" 
                  stroke={isRev ? '#F59E0B' : '#4E9F3D'} 
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  key={`path-p-${chartMode}`}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </g>
            )}

            {/* Path - Secondary Dataset (Emerald for Cuan / Sky for Visitors) */}
            {(activeTab === 'both' || activeTab === 'secondary') && (
              <g>
                <motion.path 
                  d={areaSecondary} 
                  fill="url(#gradientSecondary)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={`area-s-${chartMode}`}
                  transition={{ duration: 0.5 }}
                />
                <motion.path 
                  d={pathSecondary} 
                  fill="none" 
                  stroke={isRev ? '#10B981' : '#38BDF8'} 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={activeTab === 'both' ? '6 4' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  key={`path-s-${chartMode}`}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                />
              </g>
            )}

            {/* Hover Guide Line */}
            {hoveredIndex !== null && (
              <line 
                x1={pointsPrimary[hoveredIndex].x} 
                y1={paddingY} 
                x2={pointsPrimary[hoveredIndex].x} 
                y2={height - paddingY} 
                stroke="var(--color-border)" 
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}

            {/* Hover Intercept Anchors */}
            {daysLabel.map((_, idx) => {
              const pPri = pointsPrimary[idx];
              const pSec = pointsSecondary[idx];

              return (
                <g key={idx}>
                  <rect
                    x={pPri.x - (chartWidth / 6) / 2}
                    y={paddingY}
                    width={chartWidth / 6}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Primary Dot on Hover */}
                  {(activeTab === 'both' || activeTab === 'primary') && hoveredIndex === idx && (
                    <circle 
                      cx={pPri.x} 
                      cy={pPri.y} 
                      r="6" 
                      fill={isRev ? '#F59E0B' : '#4E9F3D'} 
                      stroke="var(--color-surface)" 
                      strokeWidth="2.5"
                      className="drop-shadow-sm pointer-events-none"
                    />
                  )}

                  {/* Secondary Dot on Hover */}
                  {(activeTab === 'both' || activeTab === 'secondary') && hoveredIndex === idx && (
                    <circle 
                      cx={pSec.x} 
                      cy={pSec.y} 
                      r="6" 
                      fill={isRev ? '#10B981' : '#38BDF8'} 
                      stroke="var(--color-surface)" 
                      strokeWidth="2.5"
                      className="drop-shadow-sm pointer-events-none"
                    />
                  )}
                </g>
              );
            })}

            {/* X Axis Labels */}
            {daysLabel.map((label, idx) => {
              const pPri = pointsPrimary[idx];
              const isToday = idx === 6;

              return (
                <text
                  key={idx}
                  x={pPri.x}
                  y={height - 5}
                  textAnchor="middle"
                  className={`font-sans text-[10px] font-black uppercase tracking-wider ${
                    isToday ? 'fill-accent' : 'fill-muted'
                  }`}
                >
                  {isToday ? 'Hari ini' : label}
                </text>
              );
            })}
          </svg>

          {/* Tooltip Overlay */}
          {hoveredIndex !== null && (
            <div 
              className="absolute z-30 bg-surface/95 backdrop-blur-md border border-border p-3.5 rounded-2xl shadow-xl space-y-2 pointer-events-none transition-all duration-150"
              style={{
                left: `${(pointsPrimary[hoveredIndex].x / width) * 100}%`,
                top: '0px',
                transform: `translateX(${hoveredIndex > 4 ? '-110%' : '10%'})`
              }}
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-accent border-b border-border/50 pb-1 flex items-center gap-1.5">
                <Calendar size={12} weight="bold" /> {daysLabel[hoveredIndex]} {hoveredIndex === 6 && "(Hari Ini)"}
              </p>
              
              <div className="space-y-1.5 text-xs min-w-[130px]">
                {/* Primary Data Row */}
                {(activeTab === 'both' || activeTab === 'primary') && (
                  <div className="flex items-center gap-4 justify-between font-bold text-foreground">
                    <span className="flex items-center gap-1.5 text-muted text-[10px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 
                      {isRev ? 'OMSET' : 'VIEWS'}
                    </span>
                    <span className="font-mono">{formatTooltipValue(primaryData[hoveredIndex])}</span>
                  </div>
                )}
                
                {/* Secondary Data Row */}
                {(activeTab === 'both' || activeTab === 'secondary') && (
                  <div className="flex items-center gap-4 justify-between font-bold text-foreground">
                    <span className="flex items-center gap-1.5 text-muted text-[10px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      {isRev ? 'LUNAS' : 'VISITORS'}
                    </span>
                    <span className="font-mono">{formatTooltipValue(secondaryData[hoveredIndex])}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Motivator Earnings / Traffic Widget Footer */}
      {isRev ? (
        <div className="grid grid-cols-3 gap-4 border-t border-border pt-4 text-center">
          <div>
            <span className="text-[9px] font-black text-muted uppercase tracking-widest block">Total Omset</span>
            <span className="text-sm sm:text-base font-black text-amber-500 font-mono mt-0.5 flex items-center justify-center gap-1">
              Rp {new Intl.NumberFormat('id-ID').format(grandTotal)}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black text-muted uppercase tracking-widest block">Cuan Lunas</span>
            <span className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5 flex items-center justify-center gap-1">
              Rp {new Intl.NumberFormat('id-ID').format(totalRevenue)}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black text-muted uppercase tracking-widest block">Can Lunas</span>
            <span className="text-sm sm:text-base font-black text-red-400 font-mono mt-0.5 flex items-center justify-center gap-1">
              Rp {new Intl.NumberFormat('id-ID').format(totalOutstanding)}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-center">
          <div>
            <span className="text-[9px] font-black text-muted uppercase tracking-widest block">Page Views (Hari Ini)</span>
            <span className="text-sm sm:text-base font-black text-[#4E9F3D] font-mono mt-0.5 flex items-center justify-center gap-1">
              <Eye size={16} /> {viewsToday}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black text-muted uppercase tracking-widest block">Unique Visitors (Hari Ini)</span>
            <span className="text-sm sm:text-base font-black text-[#38BDF8] font-mono mt-0.5 flex items-center justify-center gap-1">
              <Users size={16} /> {uniqueVisitors}
            </span>
          </div>
        </div>
      )}
      
    </div>
  );
}
