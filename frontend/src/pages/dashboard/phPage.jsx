import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import CustomLineChart from './components/linechart/linechart';
import CustomList from './components/list/customList';
import AverageInfoCard from '../../components/infoCards/averageInfoCard';
import LoadingScreen from '../../components/LoadingScreen';

export default function PhPage() {
  const { setSelectedIndex } = useSidebar();
  const {
    userData,
    fetchUserData,
    dashboardFilterInitialData,
    dashboardFilterFinalData,
    loading
  } = useUser();

  useEffect(() => {
    fetchUserData();
    setSelectedIndex(2);
  }, []);

  if (loading || userData === null) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full flex p-8 text-black flex-col">
      <div className='w-full h-60'>
        <div className='w-full h-15 bg-white rounded-md mb-4 p-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden'>
          <div className='w-1/5 h-full bg-blue-950 rounded-md flex items-center justify-center'>
            <div className='text-white font-bold text-center w-full h-full items-center p-2'>
              Nível de pH
              {dashboardFilterFinalData}
            </div>
          </div>
        </div>

        <CustomLineChart info="ph" />

        <div className='w-full h-100 rounded-md mb-2 flex flex-row gap-4'>
          {/* Average info cards */}
          <div className='w-1/2 h-full mt-4 grid grid-cols-2 gap-4'>
            <div className='bg-white w-full h-min rounded-md'>
              <AverageInfoCard info="lum" />
            </div>
            <div className='bg-white w-full h-min rounded-md'>
              <AverageInfoCard info="ph" />
            </div>
            <div className='bg-white w-full h-full rounded-md'>
              <AverageInfoCard info="temp" />
            </div>
            <div className='bg-white w-full h-full rounded-md'>
              <AverageInfoCard info="batery" />
            </div>
          </div>

          {/* Custom list */}
          <div className='bg-white w-1/2 h-104 mt-4 rounded-md'>
            <CustomList info="ph" />
          </div>
        </div>
      </div>
    </div>
  );
}
