import React from "react";

export default function AnalyticsCharts({ stats }) {
  if (!stats) return null;

  const trendData = stats.trendData || [];
  const stageDistribution = stats.stageDistribution || [];
  const courseDistribution = stats.courseDistribution || [];
  const priorityDistribution = stats.priorityDistribution || [];

  // Helper for trend line coords
  const maxTrendVal = Math.max(...trendData.map(d => d.count), 5);
  const chartHeight = 130;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const getTrendPoints = () => {
    if (trendData.length === 0) return { linePath: "", areaPath: "" };
    
    const points = trendData.map((d, index) => {
      const x = paddingX + (index * (chartWidth - paddingX * 2)) / (trendData.length - 1);
      // Invert Y since SVG y=0 is top
      const y = chartHeight - paddingY - (d.count / maxTrendVal) * (chartHeight - paddingY * 2);
      return { x, y };
    });

    // Create a smooth curve using cubic bezier approximation or simple lines
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      // Control points for smooth bezier
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;
    return { linePath, areaPath, points };
  };

  const { linePath, areaPath, points = [] } = getTrendPoints();

  // Helper for Priority Donut Chart
  const totalPriorityCount = priorityDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const priorityData = ["High", "Medium", "Low"].map(level => {
    const found = priorityDistribution.find(p => p.priority.toLowerCase() === level.toLowerCase());
    return {
      name: level,
      count: found ? found.count : 0,
      color: level === "High" ? "#ef4444" : level === "Medium" ? "#f59e0b" : "#64748b",
      bgColor: level === "High" ? "bg-red-500" : level === "Medium" ? "bg-amber-500" : "bg-slate-500",
    };
  });

  // Calculate slices for SVG donut
  let cumulativePercent = 0;
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~314.16
  const slices = priorityData.map(p => {
    const percent = p.count / totalPriorityCount;
    const strokeDasharray = `${percent * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -cumulativePercent * donutCircumference;
    cumulativePercent += percent;
    return { ...p, strokeDasharray, strokeDashoffset };
  });

  // Helper for Course Distribution Vertical Bars
  const maxCourseCount = Math.max(...courseDistribution.map(c => c.count), 5);
  const courseColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

  // Helper for Stage distribution sorting/filtering
  const topStages = [...stageDistribution]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxStageCount = Math.max(...topStages.map(s => s.count), 5);

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>

      {/* Row 1: Stage Breakdown & Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Lead Registration Trend</h3>
            <p className="text-sm text-gray-400 mb-4">Leads registered over the last 7 days</p>
          </div>
          <div className="relative w-full h-[150px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#f3f4f6" strokeDasharray="3 3" />
              <line x1={paddingX} y1={(chartHeight) / 2} x2={chartWidth - paddingX} y2={(chartHeight) / 2} stroke="#f3f4f6" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#e5e7eb" />

              {/* Y Axis Labels */}
              <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-medium">{maxTrendVal}</text>
              <text x={paddingX - 10} y={(chartHeight) / 2 + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-medium">{Math.round(maxTrendVal / 2)}</text>
              <text x={paddingX - 10} y={chartHeight - paddingY + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-medium">0</text>

              {/* Area and Line */}
              {linePath && (
                <>
                  <path d={areaPath} fill="url(#trendAreaGrad)" />
                  <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
                </>
              )}

              {/* Data Points */}
              {points.map((pt, i) => (
                <g key={i} className="group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-200 cursor-pointer hover:r-7"
                  />
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <rect
                      x={pt.x - 20}
                      y={pt.y - 32}
                      width="40"
                      height="20"
                      rx="6"
                      fill="#1f2937"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 18}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[10px] font-bold"
                    >
                      {trendData[i].count}
                    </text>
                  </g>
                </g>
              ))}

              {/* X Axis Labels */}
              {trendData.map((d, i) => {
                const x = paddingX + (i * (chartWidth - paddingX * 2)) / (trendData.length - 1);
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className="text-[10px] fill-gray-400 font-medium"
                  >
                    {d.date.split(",")[0]}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Lead Stages Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Lead Stages Breakdown</h3>
            <p className="text-sm text-gray-400 mb-4">Top active workflow stages</p>
          </div>
          <div className="space-y-3.5">
            {topStages.length > 0 ? (
              topStages.map((stageItem, index) => {
                const percentage = Math.round((stageItem.count / stats.totalLeads) * 100) || 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-700">{stageItem.stage}</span>
                      <span className="text-gray-500">{stageItem.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(stageItem.count / maxStageCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 py-10">No lead stages data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Course Distribution & Priority Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Popular Courses</h3>
            <p className="text-sm text-gray-400 mb-6">Leads distributed by registered courses</p>
          </div>
          <div className="flex items-end justify-between h-[160px] px-4 pb-2 border-b border-gray-100">
            {courseDistribution.map((c, i) => {
              const heightPct = (c.count / maxCourseCount) * 100;
              const color = courseColors[i % courseColors.length];
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-12 flex justify-center items-end" style={{ height: "120px" }}>
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {c.count} leads
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPct}%`, backgroundColor: color }}
                      className="w-8 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-semibold mt-2 text-center line-clamp-1 w-20">
                    {c.course}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Lead Priorities</h3>
            <p className="text-sm text-gray-400 mb-4">Breakdown of leads by hotness/urgency</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36">
              <svg width="100%" height="100%" viewBox="0 0 120 120" className="-rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#f3f4f6"
                  strokeWidth="10"
                />
                {slices.map((slice, i) => (
                  <circle
                    key={i}
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="12"
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              {/* Inner Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-800">{stats.totalLeads}</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Leads</span>
              </div>
            </div>

            {/* Legends */}
            <div className="space-y-3 w-40">
              {slices.map((slice, i) => {
                const percentage = Math.round((slice.count / totalPriorityCount) * 100) || 0;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${slice.bgColor}`}></span>
                      <span className="text-sm font-semibold text-gray-700">{slice.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {slice.count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
