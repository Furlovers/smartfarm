import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 240;
const cx = 140;
const cy = 110;
const iR = 50;
const oR = 100;

const getMaxByInfo = (info) => {
  switch (info) {
    case 'lum':
    case 'batery':
      return 100;
    case 'temp':
      return 50;
    case 'ph':
      return 14;
    default:
      return 100;
  }
};

const needle = (value, total, cx, cy, iR, oR, color) => {
  const startAngle = 210;
  const endAngle = -30;
  const range = startAngle - endAngle;
  const ang = startAngle - (value / total) * range;

  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="needle-circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      key="needle-path"
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} Z`}
      stroke="none"
      fill={color}
    />,
  ];
};

export default function PieWithNeedle({ average, info }) {
  const max = getMaxByInfo(info);
  const cappedAverage = Math.min(Math.max(average, 0), max);

  const data = [
    { name: 'Preenchido', value: cappedAverage, color: '#162456' },
    { name: 'Vazio', value: max - cappedAverage, color: '#e9ebf2' },
  ];

  return (
    <ResponsiveContainer width="100%" height="82%">
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={210}
          endAngle={-30}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          stroke="none"
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(cappedAverage, max, cx, cy, iR, oR, '#f25050')}
      </PieChart>
    </ResponsiveContainer>
  );
}
