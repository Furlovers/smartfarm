import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import CustomLineChart from './components/linechart/linechart';
import CustomList from './components/list/customList';
import AverageInfoCard from './components/infoCards/averageInfoCard';
import PieWithNeedle from './components/infoCards/needleChart';

export default function LumPage() {

        const { setSelectedIndex } = useSidebar()
        const { userData, dashboardFilterInitialData, dashboardFilterFinalData } = useUser()

    
        useEffect(() => {
        setSelectedIndex(1)
      }, [setSelectedIndex])

    return <div className="w-full h-full flex p-8 text-black text-5x flex-col">
      <div className='w-full h-60'>
        <div className='w-full h-15  bg-white rounded-md mb-4 p-2'>
          <div className='w-1/5 h-full bg-blue-950 rounded-md flex items-center justify-center'>
            <div className='text-white text-sm w-full h-full flex items-center p-2'>
             {dashboardFilterFinalData}
            </div>
          </div>
        </div>
        <div>
        </div>
        <CustomLineChart info={"lum"}/>
        <div className='w-full h-100 rounded-md mb-2 flex flex-row gap-4'>
          <div className=' w-1/2 h-full mt-4 grid grid-cols-2 gap-4'>
            <div className='bg-white w-full h-min rounded-md'>
              
              <AverageInfoCard info={"lum"} />
            </div>
            <div className='bg-white h-min w-full rounded-md'>
                <AverageInfoCard info={"ph"}/>
            </div>
            <div className='bg-white w-full h-full rounded-md'>
              <AverageInfoCard info={"temp"}/>
            </div>
            <div className='bg-white w-full h-full rounded-md'>
              <AverageInfoCard info={"batery"}/>
            </div>
          </div>
          <div className='bg-white w-1/2 h-104 mt-4 rounded-md'>
              <CustomList data={userData} info={"lum"}/>
          </div>
        </div>
      </div>
    </div>
}