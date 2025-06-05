import { processListData, getDiferenceReadingVsAverage } from "../../../../utils/statistics";
import { useUser } from "../../../../utils/contexts/UserContext";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

export default function CustomList({ info }) {
  const { userData } = useUser();

  return (
    <>
      <div className='w-full h-1/9 bg-blue-950 rounded-t-md flex items-center justify-between px-2 text-white'>
        <div className="font-bold w-[19%] text-center">Data</div>
        <div className="w-[0.5px] h-full bg-gray-400 rounded-full mr-1"></div>
        <div className="font-bold w-1/5 text-center">Sensor</div>
        <div className="w-[0.5px] h-full bg-gray-400 rounded-full mr-1"></div>
        <div className="font-bold w-1/3 text-center">
          Leitura de {info === "lum" ? "Luminosidade" : info === "temp" ? "Temperatura" : info === "batery" ? "Bateria" : info === "ph" ? "pH" : ""}
        </div>
        <div className="w-[0.5px] h-full bg-gray-400 rounded-full mr-1"></div>
        <div className="font-bold text-sm w-1/5 text-center">% Dif Média</div>
      </div>

      <div className='w-full h-8/9 rounded-b-md flex overflow-y-scroll flex-col items-center gap-1 px-2'>
        {processListData(userData.sensorList, userData.readings, info).map((item, index) => {
          const localDate = new Date(item.date);
          localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());

          const diff = getDiferenceReadingVsAverage(userData.sensorList, userData.readings, info, item.sensorId, item.value);
          const isPositive = diff >= 0;

          return (
            <div key={index} className='w-full flex items-center justify-between p-1 flex-row'>
              <div className='flex items-center'>
                <div className='border-2 border-blue-950 h-8 w-30 rounded-sm flex items-center justify-center mr-2 text-lg font-bold'>
                  {localDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
                <div className='mr-2 w-[40%] text-center ml-6'>
                  Sensor #{item.sensorId}
                </div>
              </div>

              <div className="w-[40%] h-8 flex items-center justify-center font-bold text-md">
                {item.value} {info === "lum" || info === "batery" ? "%" : info === "temp" ? "°C" : ""}
              </div>

              <div
                className={`p-2 rounded-md w-18 h-8 flex items-center gap-1 justify-center ${
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