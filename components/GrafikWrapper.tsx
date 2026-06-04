"use client";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const CHART_COLORS = {
  finans: ['#ffb347', '#ff8c00', '#ffd700', '#ff6b35'],
  isHukuku: ['#4d8bff', '#2563eb', '#93c5fd', '#1e3a8a'],
  egitim: ['#00e887', '#059669', '#6ee7b7', '#064e3b'],
  saglik: ['#ff4d6d', '#dc2626', '#fca5a5', '#7f1d1d'],
  faturalar: ['#fbbf24', '#d97706', '#fde68a', '#78350f'],
  konut: ['#fb923c', '#ea580c', '#fed7aa', '#9a3412'],
  matematik: ['#a78bfa', '#7c3aed', '#ddd6fe', '#4c1d95']
};

export default function GrafikWrapper({ type, data, colors, height = 280 }: { type: 'bar'|'pie'|'line'|'gauge'; data: any[]; colors: string[]; height?: number }) {
  if (!data || data.length === 0) return null;

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" stroke="#6b6b8a" />
          <YAxis stroke="#6b6b8a" />
          <Tooltip contentStyle={{ backgroundColor: '#13131f', borderColor: '#1e1e30' }} itemStyle={{ color: '#e2e2f0' }} />
          <Legend />
          <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`} outerRadius={height / 2 - 20} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#13131f', borderColor: '#1e1e30' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" stroke="#6b6b8a" />
          <YAxis stroke="#6b6b8a" />
          <Tooltip contentStyle={{ backgroundColor: '#13131f', borderColor: '#1e1e30' }} />
          <Legend />
          {Object.keys(data[0]).filter(k => k !== 'name').map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'gauge') {
    const value = data[0]?.value || 0;
    const min = 10;
    const max = 40;
    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const angle = percentage * 180 - 90;
    
    return (
      <div className="flex flex-col items-center justify-center relative" style={{ height }}>
        <div className="relative w-64 h-32 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[30px] border-gray-700" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[30px] border-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', borderTopColor: colors[0], borderRightColor: colors[0], transform: 'rotate(-45deg)' }}></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-32 bg-white origin-bottom transition-transform duration-1000 ease-out" style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}>
            <div className="w-4 h-4 bg-white rounded-full absolute -top-2 -left-1.5 shadow-lg"></div>
          </div>
        </div>
        <div className="text-3xl font-bold mt-4 font-mono">{value.toFixed(1)}</div>
        <div className="text-gray-400 text-sm mt-1">BMI Değeri</div>
      </div>
    );
  }

  return null;
}
