import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';

const RADIAN = Math.PI / 180;

const getBaseMaxByInfo = (info) => {
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

const renderNeedle = (value, max) => {
  const angle = 210 - (value / max) * 240;
  const length = 60;
  const cx = 145;
  const cy = 100;

  const angleRad = RADIAN * angle;
  const x = cx + length * Math.cos(angleRad);
  const y = cy - length * Math.sin(angleRad);

  const baseLeftX = cx + 5 * Math.cos(angleRad + Math.PI / 2);
  const baseLeftY = cy - 5 * Math.sin(angleRad + Math.PI / 2);
  const baseRightX = cx + 5 * Math.cos(angleRad - Math.PI / 2);
  const baseRightY = cy - 5 * Math.sin(angleRad - Math.PI / 2);

  return [
    <circle key="center" cx={cx} cy={cy} r={5} fill="#f25050" />,
    <path
      key="needle"
      d={`M${baseLeftX},${baseLeftY} L${baseRightX},${baseRightY} L${x},${y} Z`}
      fill="#f25050"
    />,
  ];
};

const renderTicks = (max) => {
  const cx = 100;
  const cy = 100;
  const radius = 70;

  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((i * max) / 4));

  return ticks.map((value, i) => {
    const angle = 210 - (i * 60);
    const x = cx + radius * Math.cos(RADIAN * angle);
    const y = cy - radius * Math.sin(RADIAN * angle);

    return (
      <Text
        key={`tick-${value}`}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fill="#555"
      >
        {value}
      </Text>
    );
  });
};

export default function PieWithNeedle({ average, info }) {
  const baseMax = getBaseMaxByInfo(info);
  const dynamicMax = average > baseMax ? Math.ceil(average / baseMax) * baseMax : baseMax;

  const cappedAverage = Math.min(average, dynamicMax);

  const data = [
    { name: 'Preenchido', value: cappedAverage, color: '#162456' },
    { name: 'Restante', value: dynamicMax - cappedAverage, color: '#e9ebf2' },
  ];

  return (
    <div className="flex items-center justify-center w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={210}
            endAngle={-30}
            cx={145}
            cy={100}
            innerRadius={50}
            outerRadius={80}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {renderNeedle(average, dynamicMax)}
          {renderTicks(dynamicMax)}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
