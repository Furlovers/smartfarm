import { getAllReadingsAverage } from "../../../../utils/dashHelper";
import PieWithNeedle from "./needleChart";
import { useUser } from "../../../../utils/contexts/UserContext";

export default function AverageInfoCard({ info}) {

    const { userData } = useUser()
    const average = getAllReadingsAverage(userData.sensors, info)

    return (
        <div className="relative w-full h-[210px]   flex flex-col items-center justify-center text-black text-5x  rounded-md">
            <div className='w-full flex items-center justify-center text-xl font-bold'>
                Média de {(info === "lum" ?  "Luminosidade": info === "temp" ? "Tempratura" : info === "batery" ? "Bateria" : info === "ph" ? "pH" : "")}
              </div>
            <PieWithNeedle average={average} info={info}></PieWithNeedle>
            <div className="mr-3  flex items-end justify-center font-bold text-2xl w-full absolute bottom-5 ml-2">
                {average}{info === "lum" || info === "batery" ? "%" : info === "temp" ? "°C" : ""}
            </div>
        </div>
    )
}