import AverageInfoCard from "./averageInfoCard"
import { getAllReadingsMax, getAllReadingsMin, processListData} from "../../utils/dashHelper"
import { useUser } from "../../utils/contexts/UserContext"

export default function CardsGrid({info}){

    const {userData} = useUser();

    return <>
    <div className='w-1/2 h-40 mt-4 grid grid-cols-2 gap-4'>
                <div className='bg-white w-full h-min rounded-md flex items-center justify-center'>
                  <AverageInfoCard info= {info} />
                </div>
                <div className='bg-white w-full h-min rounded-md flex items-center justify-center'>
                  <div className='w-100 h-52 flex items-center justify-between text-xl font-bold flex-col shadow-sm hover:shadow-lg'>
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
                <div className='w-100 h-52 flex items-center justify-between text-xl font-bold flex-col shadow-sm hover:shadow-lg'>
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
                    <div className='w-100 h-52 flex flex-col items-center justify-between text-xl font-bold shadow-sm hover:shadow-lg'>
                    Quantidade de leituras
                    <a className="h-[80%] flex justify-center items-center text-4xl">
                     {processListData(userData.sensorList, info).length}
                    </a>
                    </div>
                </div>
    </div>
    </>
}