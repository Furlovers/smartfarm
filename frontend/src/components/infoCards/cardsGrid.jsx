import AverageInfoCard from "./averageInfoCard"
import { getAllReadingsMax, getAllReadingsMin } from "../../utils/dashHelper"
import { useUser } from "../../utils/contexts/UserContext"

export default function CardsGrid({info}){

    const {userData} = useUser();

    return <>
    <div className='w-1/2 h-40 mt-4 grid grid-cols-2 gap-4'>
                <div className='bg-white w-full h-min rounded-md flex items-center justify-center'>
                  <AverageInfoCard info= {info} />
                </div>
                <div className='bg-white w-full h-min rounded-md flex items-center justify-center'>
                  <div className='w-100 h-52 flex items-center justify-between text-xl font-bold flex-col'>
                    Valor máximo
                    <a className="h-[80%] flex justify-center items-center text-4xl">
                    {getAllReadingsMax(userData.sensorList, info)}{info === "lum" || info === "batery"
                        ? "%"
                        : info === "temp"
                        ? "°C"
                        : ""}
                    </a>
                    
                  </div>
                </div>
                <div className='bg-white w-full h-full rounded-md flex items-center justify-center'>
                <div className='w-100 h-52 flex items-center justify-between text-xl font-bold flex-col'>
                    Valor máximo
                    <a className="h-[80%] flex justify-center items-center text-4xl">
                    {getAllReadingsMin(userData.sensorList, info)}{info === "lum" || info === "batery"
                        ? "%"
                        : info === "temp"
                        ? "°C"
                        : ""}
                    </a>
                    
                  </div>
                </div>
                <div className='bg-white w-full h-full rounded-md flex items-center justify-center'>
                    <div className='w-100 h-52 flex items-center justify-center text-xl font-bold'>
                    
                    </div>
                </div>
    </div>
    </>
}