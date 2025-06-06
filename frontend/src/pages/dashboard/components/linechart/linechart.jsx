import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaSun,
  FaFlask,
  FaThermometerHalf,
  FaBatteryFull,
} from "react-icons/fa";

import { useUser } from "../../../../utils/contexts/UserContext";
import { processChartData } from "../../../../utils/dashHelper";

export default function CustomLineChart({ info }) {
  const { userData } = useUser();

  const chartData = processChartData(userData.sensorList, info);

  return (
    <div className="h-full w-full bg-white rounded-md shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <ResponsiveContainer
        width="99%"
        height="100%"
        className="pt-2 rounded-md"
      >
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => {
              const localDate = new Date(date);
              localDate.setMinutes(
                localDate.getMinutes() + localDate.getTimezoneOffset()
              );
              return localDate.toLocaleDateString("pt-BR");
            }}
          />
          <YAxis tick={{ fontSize: 12 }} domain={["dataMin", "dataMax"]} />
          <Tooltip content={<CustomTooltip info={info} />} />

          {userData?.sensorList.map((sensor, index) => {
            const colors = [
              "#e64c6a",
              "#8884d8",
              "#82ca9d",
              "#ffc658",
              "#ff8042",
            ];
            const color = colors[index % colors.length];

            return (
              <Line
                key={sensor._id}
                type="monotone"
                dataKey={`sensor_${sensor._id}`}
                name={`Sensor #${sensor._id}`}
                stroke={color}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 3 }}
                connectNulls={true}        // <- LINHA ADICIONADA AQUI
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, info }) => {
  if (!active || !payload || !payload.length) return null;

  const localDate = new Date(label);
  localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());

  const getInfoTitle = () => {
    switch (info) {
      case "lum":
        return "Luminosidade";
      case "ph":
        return "pH";
      case "temp":
        return "Temperatura";
      case "batery":
        return "Bateria";
      default:
        return "Valor";
    }
  };

  const getInfoIcon = () => {
    switch (info) {
      case "lum":
        return <FaSun size={24} />;
      case "ph":
        return <FaFlask size={24} />;
      case "temp":
        return <FaThermometerHalf size={24} />;
      case "batery":
        return <FaBatteryFull size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-950 px-4 pb-4 border border-gray-200 rounded-lg shadow-lg">
      <div className="flex flex-row text-gray-100 items-center">
        <div className="mt-3 mr-2">{getInfoIcon()}</div>
        <p className="mt-2 text-2xl font-bold text-gray-100">
          {getInfoTitle()}
        </p>
      </div>
      <p className="font-bold text-white">
        <div className="flex items-center justify-between">
          <div>{localDate.toLocaleDateString("pt-BR")}</div>
          <div>
            {localDate.getHours().toString().padStart(2, "0")}:
            {localDate.getMinutes().toString().padStart(2, "0")}:
            {localDate.getSeconds().toString().padStart(2, "0")}
          </div>
        </div>
        <div className="w-full h-[0.5px] bg-gray-500 rounded-md mt-3"></div>
      </p>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center justify-between bg-gray-900 p-1"
          >
            <div className="flex flex-row items-center">
              <div
                className="w-1 h-6 mr-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-white">
                {entry.name}:
              </span>
            </div>
            <span className="text-md font-semibold ml-1 text-white">
              {entry.value}
              {info === "temp"
                ? "°C"
                : info === "batery" || info === "lum"
                ? "%"
                : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
