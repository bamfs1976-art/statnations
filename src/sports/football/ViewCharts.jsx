import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart,
} from 'recharts';

/**
 * Charts for the football module's secondary views (British Championship, UFWC,
 * head-to-head, decades, venues, team profile).
 *
 * They live outside index.jsx so that recharts and its d3 dependencies are not
 * part of the football chunk. Statically importing them there meant 300 KB of
 * charting code downloaded and parsed on the overview, which shows none of these.
 */

const TT = {
  background: 'var(--surface-raised)', border: '1px solid var(--line-strong)',
  borderRadius: 10, fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-body)',
};
const GRID = 'var(--line)';
const AXIS = { fill: 'var(--text-muted)', fontSize: 11 };
const AXIS_CAT = { fill: 'var(--text)', fontSize: 11 };

function BhcTitles({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis dataKey="team" tick={AXIS_CAT} />
        <YAxis allowDecimals={false} tick={AXIS} label={{ value: 'Titles', angle: -90, position: 'insideLeft', fill: 'var(--text-faint)', fontSize: 11 }} />
        <Tooltip contentStyle={TT} />
        <Bar dataKey="titles" name="Titles" radius={[6, 6, 0, 0]}>
          {data.map((e, i) => <Cell key={i} fill={e.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function UfwcHolders({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ bottom: 18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis type="number" allowDecimals={false} tick={AXIS} label={{ value: 'Title matches', position: 'insideBottom', offset: -10, fill: 'var(--text-faint)', fontSize: 11 }} />
        <YAxis type="category" dataKey="team" width={100} interval={0} tick={AXIS_CAT} />
        <Tooltip contentStyle={TT} />
        <Bar dataKey="times" name="Title Matches" radius={[0, 6, 6, 0]}>
          {data.map((e, i) => <Cell key={i} fill={e.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function H2HPie({ data }) {
  return (
    <ResponsiveContainer width={280} height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false}
             label={entry => `${entry.name}: ${entry.value}`}>
          {data.map((e, i) => <Cell key={i} fill={e.fill} />)}
        </Pie>
        <Tooltip contentStyle={TT} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Decades({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ bottom: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis dataKey="decade" interval={0} tick={AXIS} label={{ value: 'Decade', position: 'insideBottom', offset: -12, fill: 'var(--text-faint)', fontSize: 11 }} />
        <YAxis yAxisId="left" tick={AXIS} />
        <YAxis yAxisId="right" orientation="right" tick={AXIS} />
        <Tooltip contentStyle={TT} />
        <Legend />
        <Bar yAxisId="left" dataKey="matches" name="Matches" fill="color-mix(in srgb, var(--accent) 45%, transparent)" radius={[4, 4, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="avgGoals" name="Avg Goals" stroke="var(--accent-warn)" strokeWidth={2} dot={{ r: 4, fill: 'var(--accent-warn)' }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function Venues({ data }) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data} layout="vertical" margin={{ bottom: 18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis type="number" tick={AXIS} label={{ value: 'Matches hosted', position: 'insideBottom', offset: -10, fill: 'var(--text-faint)', fontSize: 11 }} />
        <YAxis type="category" dataKey="country" width={110} interval={0} tick={AXIS_CAT} />
        <Tooltip contentStyle={TT} />
        <Bar dataKey="matches" name="Matches" fill="color-mix(in srgb, var(--accent) 55%, transparent)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TeamWinPct({ data, accent }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} interval={3} angle={-30} textAnchor="end" height={40} />
        <YAxis domain={[0, 100]} tick={AXIS} label={{ value: 'Win %', angle: -90, position: 'insideLeft', fill: 'var(--text-faint)', fontSize: 11 }} />
        <Tooltip contentStyle={TT} />
        <Bar dataKey="winPct" name="Win %" radius={[4, 4, 0, 0]}>
          {data.map((e, i) => (
            <Cell key={i} fill={e.winPct >= 70 ? 'var(--accent-brand)' : e.winPct >= 50 ? accent : e.winPct >= 30 ? 'var(--accent-warn)' : 'var(--accent-danger)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function TeamGoals({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} interval={3} angle={-30} textAnchor="end" height={40} />
        <YAxis tick={AXIS} label={{ value: 'Goals per match', angle: -90, position: 'insideLeft', fill: 'var(--text-faint)', fontSize: 11 }} />
        <Tooltip contentStyle={TT} />
        <Legend />
        <Line type="monotone" dataKey="avgGF" name="Avg Scored" stroke="var(--accent-brand)" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="avgGA" name="Avg Conceded" stroke="var(--accent-danger)" strokeWidth={2} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const KINDS = {
  'bhc-titles': BhcTitles,
  'ufwc-holders': UfwcHolders,
  'h2h-pie': H2HPie,
  decades: Decades,
  venues: Venues,
  'team-winpct': TeamWinPct,
  'team-goals': TeamGoals,
};

export default function FBChart(props) {
  const Chart = KINDS[props.kind];
  return Chart ? <Chart {...props} /> : null;
}
