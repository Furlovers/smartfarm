import PieWithNeedle from "./needleChart";
import { getAllReadingsAverage } from "../../utils/dashHelper";
import { useUser } from "../../utils/contexts/UserContext";

export default function AverageInfoCard({ info }) {
  const { userData } = useUser();

  const average = getAllReadingsAverage(userData.sensorList, info);

  return (
    <div className="relative w-full h-[210px] flex flex-col items-center justify-center text-black rounded-md shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className='w-full flex items-center justify-center text-xl font-bold'>
        Média de {info === "lum"
          ? "Luminosidade"
          : info === "temp"
          ? "Temperatura"
          : info === "batery"
          ? "Bateria"
          : info === "ph"
          ? "pH"
          : ""}
      </div>

      
      <div className="flex items-center justify-center w-full h-full">
        <PieWithNeedle average={average} info={info} />
      </div>

      <div className="mr-3 flex items-end justify-center font-bold text-2xl w-full absolute bottom-5 ml-2">
        {average}
        {info === "lum" || info === "batery"
          ? "%"
          : info === "temp"
          ? "°C"
          : ""}
      </div>
    </div>
  );
}
