import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area,
} from 'recharts';

/**
 * The overview charts live in their own module so the charting stack is fetched
 * after the first paint rather than blocking it. Everything here is presentation:
 * the data and the axis labels arrive as props.
 */

const TT = {
  background: 'var(--surface-raised)',
  border: '1px solid var(--line-strong)',
  borderRadius: 10,
  fontSize: 13,
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
};

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function WorldCupChart({ data, metric }) {
  const axisLabel = metric === 'wins' ? 'Titles' : metric === 'finals' ? 'Finals reached' : 'Tournaments played';
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 20, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
        <XAxis
          type="number" allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          label={{ value: axisLabel, position: 'insideBottom', offset: -12, fill: 'var(--text-faint)', fontSize: 12 }}
        />
        <YAxis type="category" dataKey="team" width={104} interval={0} tick={{ fill: 'var(--text)', fontSize: 12 }} />
        <Tooltip contentStyle={TT} cursor={{ fill: 'var(--surface-raised)' }} formatter={v => [v, axisLabel]} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={!reducedMotion()}>
          {data.map((e, i) => <Cell key={i} fill={e.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function GoalsChart({ data, metric }) {
  const key = metric === 'total' ? 'goals' : 'perMatch';
  const yLabel = metric === 'total' ? 'Goals scored' : 'Goals per match';
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 20, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
        {/* interval={0} labels every decade — the axis must never span a wider
            range than the series it is drawn from. */}
        <XAxis
          dataKey="decade" interval={0} angle={-40} textAnchor="end" height={56}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          label={{ value: 'Decade', position: 'insideBottom', offset: -16, fill: 'var(--text-faint)', fontSize: 12 }}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }} width={62}
          label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: 'var(--text-faint)', fontSize: 12, style: { textAnchor: 'middle' } }}
        />
        <Tooltip
          contentStyle={TT} cursor={{ stroke: 'var(--line-strong)' }}
          formatter={v => [metric === 'total' ? v.toLocaleString() : v, yLabel]}
        />
        <Area
          type="monotone" dataKey={key} stroke="var(--accent)"
          fill="color-mix(in srgb, var(--accent) 22%, transparent)" strokeWidth={2}
          isAnimationActive={!reducedMotion()}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function OverviewChart({ kind, data, metric }) {
  if (kind === 'worldcup') return <WorldCupChart data={data} metric={metric} />;
  return <GoalsChart data={data} metric={metric} />;
}
