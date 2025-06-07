import PieWithNeedle from "./needleChart";
import { getAllReadingsAverage } from "../../utils/dashHelper";
import { useUser } from "../../utils/contexts/UserContext";

export default function AverageInfoCard({ info, filteredSensors }) {
  const { userData } = useUser();
  const hasSelection = Array.isArray(filteredSensors) && filteredSensors.length > 0;

  const average = hasSelection ? getAllReadingsAverage(filteredSensors, info) : null;
  const label = {
    lum: "Luminosidade",
    temp: "Temperatura",
    batery: "Bateria",
    ph: "pH"
  }[info] || "";

  const unit = {
    lum: "%",
    batery: "%",
    temp: "°C"
  }[info] || "";

  return (
    <div className="relative w-full h-[210px] flex flex-col items-center justify-center text-black rounded-md shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="w-full flex items-center justify-center text-xl font-bold">
        Média de {label}
      </div>

      <div className="flex items-center justify-center w-full h-full">
        {hasSelection ? (
          <PieWithNeedle average={average} info={info} />
        ) : (
          <div className="text-gray-500 text-lg font-semibold ">
            Sem valor
          </div>
        )}
      </div>

      {hasSelection && (
        <div className="mr-3 flex items-end justify-center font-bold text-2xl w-full absolute bottom-5 ml-2">
          {average}
          {unit}
        </div>
      )}
    </div>
  );
}
