'use client';

import { WeeklyData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface PracticeGraphProps {
  weeklyData: WeeklyData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; hours: number } }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div
      className="rounded-lg border bg-popover px-3 py-2 shadow-md"
    >
      <p className="text-xs text-muted-foreground">{data.name}</p>
      <p className="text-sm font-semibold mt-0.5">{data.hours.toFixed(1)}h practiced</p>
    </div>
  );
}

export function PracticeGraph({ weeklyData }: PracticeGraphProps) {
  const chartData = weeklyData.map(week => {
    const weekStart = new Date(week.weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      name: `${fmt(weekStart)} – ${fmt(weekEnd)}`,
      shortName: fmt(weekStart),
      hours: week.totalHours
    };
  });

  const maxHours = Math.max(...chartData.map(d => d.hours), 1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Practice History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-sl-accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-sl-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, Math.ceil(maxHours)]}
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'var(--color-sl-accent)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="var(--color-sl-accent)"
              strokeWidth={2}
              fill="url(#areaGradient)"
              dot={{ r: 3, fill: 'var(--color-sl-accent)', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: 'var(--color-sl-accent)', strokeWidth: 2, stroke: 'var(--color-background)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
