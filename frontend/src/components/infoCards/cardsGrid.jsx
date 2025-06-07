import AverageInfoCard from "./averageInfoCard";
import {
  getAllReadingsMax,
  getAllReadingsMin,
  processListData
} from "../../utils/dashHelper";
import { useUser } from "../../utils/contexts/UserContext";
import {
  FaArrowUp,
  FaArrowDown,
  FaHashtag,
} from "react-icons/fa6";

export default function CardsGrid({ info, filteredSensors }) {
  const { userData } = useUser();

  const hasSelection = filteredSensors && filteredSensors.length > 0;

  const max = hasSelection ? getAllReadingsMax(filteredSensors, info) : null;
  const min = hasSelection ? getAllReadingsMin(filteredSensors, info) : null;
  const quantity = hasSelection
    ? processListData(filteredSensors, info).length
    : 0;

  const unit =
    info === "lum" || info === "batery"
      ? "%"
      : info === "temp"
      ? "°C"
      : "";

  return (
    <>
      <div className="w-1/2 h-40 mt-4 grid grid-cols-2 gap-4">
        
        {/* MÉDIA */}
        <div className="bg-white w-full h-min rounded-md flex items-center justify-center">
          <AverageInfoCard info={info} filteredSensors={filteredSensors} />
        </div>

        {/* VALOR MÁXIMO */}
        <div className="bg-white w-full h-min rounded-md flex items-center justify-center">
          <div className="w-100 h-52 flex items-center justify-between text-xl font-bold flex-col shadow-sm hover:shadow-lg">
            <div className="flex items-center gap-2 text-green-700">
              <FaArrowUp className="text-green-700" />
              Valor máximo
            </div>
            <div className="h-[80%] flex justify-center items-center text-4xl text-green-700">
              {hasSelection ? `${max}${unit}` : "Sem valor"}
            </div>
          </div>
        </div>

        {/* VALOR MÍNIMO */}
        <div className="bg-white w-full h-full rounded-md flex items-center justify-center">
          <div className="w-100 h-52 flex items-center justify-between text-xl font-bold flex-col shadow-sm hover:shadow-lg">
            <div className="flex items-center gap-2 text-red-700">
              <FaArrowDown className="text-red-700" />
              Valor mínimo
            </div>
            <div className="h-[80%] flex justify-center items-center text-4xl text-red-700">
              {hasSelection ? `${min}${unit}` : "Sem valor"}
            </div>
          </div>
        </div>

        {/* QUANTIDADE DE LEITURAS */}
        <div className="bg-white w-full h-full rounded-md flex items-center justify-center">
          <div className="w-100 h-52 flex flex-col items-center justify-between text-xl font-bold shadow-sm hover:shadow-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <FaHashtag className="text-blue-700" />
              Quantidade de leituras
            </div>
            <div className="h-[80%] flex justify-center items-center text-4xl text-blue-700">
              {hasSelection ? quantity : "Sem valor"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
