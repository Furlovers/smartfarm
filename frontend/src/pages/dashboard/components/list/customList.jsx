import { useState } from "react";
import { processListData, getDiferenceReadingVsAverage } from "../../../../utils/dashHelper.js";
import { useUser } from "../../../../utils/contexts/UserContext";
import { FaArrowTrendUp, FaArrowTrendDown, FaSortUp, FaSortDown } from "react-icons/fa6";

export default function CustomList({ info }) {
  const { userData } = useUser();
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <FaSortUp size={15} /> : <FaSortDown size={15} />;
  };

  const getSortedData = () => {
    return [...processListData(userData.sensorList, info)].sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "date") {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else if (sortBy === "sensor") {
        aValue = a.sensorId;
        bValue = b.sensorId;
      } else if (sortBy === "leitura") {
        aValue = a.value;
        bValue = b.value;
      } else if (sortBy === "diff") {
        aValue = getDiferenceReadingVsAverage(userData.sensorList, info, a.value);
        bValue = getDiferenceReadingVsAverage(userData.sensorList, info, b.value);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedData = getSortedData();

  return (
    <>
      <div className='w-full h-1/9 bg-blue-950 rounded-t-md flex items-center justify-between px-2 text-white'>
        <div className="font-bold w-[19%] text-center cursor-pointer flex items-center justify-center gap-1" onClick={() => toggleSort("date")}>
          Data {getSortIcon("date")}
        </div>
        <div className="w-[0.5px] h-full bg-gray-400 rounded-full mr-1"></div>
        <div className="font-bold w-1/5 text-center cursor-pointer flex items-center justify-center gap-1" onClick={() => toggleSort("sensor")}>
          Sensor {getSortIcon("sensor")}
        </div>
        <div className="w-[0.5px] h-full bg-gray-400 rounded-full mr-1"></div>
        <div className="font-bold w-1/3 text-center cursor-pointer flex items-center justify-center gap-1" onClick={() => toggleSort("leitura")}>
          Leitura de {info === "lum" ? "Luminosidade" : info === "temp" ? "Temperatura" : info === "batery" ? "Bateria" : info === "ph" ? "pH" : ""} {getSortIcon("leitura")}
        </div>
        <div className="w-[0.5px] h-full bg-gray-400 rounded-full mr-1"></div>
        <div className="font-bold text-sm w-1/5 text-center cursor-pointer flex items-center justify-center gap-1" onClick={() => toggleSort("diff")}>
          % Dif Média {getSortIcon("diff")}
        </div>
      </div>

      <div className='w-full h-8/9 rounded-b-md flex overflow-y-scroll flex-col items-center gap-1 px-2'>
        {sortedData.map((item, index) => {
          const localDate = new Date(item.date);
          localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());

          const diff = getDiferenceReadingVsAverage(userData.sensorList, info, item.value);
          const isPositive = diff >= 0;

          return (
            <div key={index} className='w-full flex items-center justify-between p-1 flex-row border-b border-gray-300'>
              <div className='flex items-center'>
                <div className='border-2 border-blue-950 h-8 w-32 rounded-sm flex items-center justify-center mr-2 text-lg font-bold'>
                  {localDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
                <div className='mr-2 w-[full] text-center ml-6'>
                  {item.sensorName}
                </div>
              </div>

              <div className="w-[full] h-8 flex items-center justify-center font-bold text-md">
                {item.value === null ? "Sem valor" : item.value + (info === "lum" || info === "batery" ? "%" : info === "temp" ? "°C" : "")}
              </div>

              <div
                className={`p-2 rounded-md w-20 h-8 flex items-center gap-1 justify-center  ${
                  isPositive ? "bg-orange-200 text-orange-800" : "bg-blue-200 text-blue-800"
                }`}
              >
                {isPositive ? (
                  <div className="flex flex-row"><FaArrowTrendUp size={12} /></div>
                ) : (
                  <div className="flex flex-row"><FaArrowTrendDown size={12} /></div>
                )}
                <div>{Math.abs(diff)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
