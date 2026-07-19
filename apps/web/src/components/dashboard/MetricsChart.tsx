'use client';

import { type JSX } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { MetricPoint } from '@meridian/shared';

interface MetricsChartProps {
  data: MetricPoint[];
  type: 'area' | 'bar';
  title: string;
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatTooltipLabel(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MetricsChart({
  data,
  type,
  title,
}: MetricsChartProps): JSX.Element {
  const chartData = data.map((pt) => ({
    ...pt,
    label: formatTimestamp(pt.timestamp),
  }));

  return (
    <div style={{ width: '100%', height: 220 }}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={180}>
        {type === 'area' ? (
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={45}
              domain={['dataMin - 100', 'auto']}
            />
            <Tooltip
              labelFormatter={(_label, payload) => {
                if (payload?.[0]) {
                  return formatTooltipLabel(payload[0].payload.timestamp);
                }
                return '';
              }}
              contentStyle={{
                borderRadius: '0.75rem',
                background: 'rgba(15,15,30,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                color: '#e4e4ec',
              }}
              itemStyle={{ color: '#a5b4fc' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              dot={{ r: 4, fill: '#6366f1', stroke: '#1e1b4b', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </AreaChart>
        ) : (
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip
              labelFormatter={(_label, payload) => {
                if (payload?.[0]) {
                  return formatTooltipLabel(payload[0].payload.timestamp);
                }
                return '';
              }}
              contentStyle={{
                borderRadius: '0.75rem',
                background: 'rgba(15,15,30,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                color: '#e4e4ec',
              }}
              itemStyle={{ color: '#a5b4fc' }}
            />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}