import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import CustomLineChart from './components/linechart/linechart';
import CustomList from './components/list/customList';
import AverageInfoCard from '../../components/infoCards/averageInfoCard';
import LoadingScreen from '../../components/LoadingScreen';

export default function LumPage() {
  const { setSelectedIndex } = useSidebar();
  const { userData, fetchUserData, dashboardFilterInitialData, dashboardFilterFinalData, loading } = useUser();

  useEffect(() => {
    fetchUserData();
    setSelectedIndex(1);
  }, []);

  if (loading || userData === null) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full flex p-8 text-black flex-col">
      <div className='w-full h-75'>
        <div className='w-full h-15 bg-white rounded-md mb-4 p-2'>
          <div className='w-1/5 h-full bg-blue-950 rounded-md flex items-center justify-center'>
            <div className='text-white text-sm w-full h-full flex items-center p-2'>
              {dashboardFilterFinalData}
            </div>
          </div>
        </div>

        <CustomLineChart info="lum" />

        <div className='w-full h-100 rounded-md mb-2 flex flex-row gap-4'>
          {/* Average info cards */}
          <div className='w-1/2 h-full mt-4 grid grid-cols-2 gap-4'>
            <div className='bg-white w-full h-min rounded-md flex items-center justify-center'>
              <AverageInfoCard info="lum" />
            </div>
            <div className='bg-white w-full h-min rounded-md flex items-center justify-center'>
              <AverageInfoCard info="ph" />
            </div>
            <div className='bg-white w-full h-full rounded-md flex items-center justify-center'>
              <AverageInfoCard info="temp" />
            </div>
            <div className='bg-white w-full h-full rounded-md flex items-center justify-center'>
              <AverageInfoCard info="batery" />
            </div>
          </div>

          {/* Custom list */}
          <div className='bg-white w-1/2 h-104 mt-4 rounded-md  '>
            <CustomList info="lum" />
          </div>
        </div>
      </div>
    </div>
  );
}
