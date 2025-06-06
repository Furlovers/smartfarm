import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import CustomLineChart from './components/linechart/linechart';
import CustomList from './components/list/customList';
import AverageInfoCard from '../../components/infoCards/averageInfoCard';
import LoadingScreen from '../../components/LoadingScreen';
import CardsGrid from '../../components/infoCards/cardsGrid';

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
    <div className="w-full h-full flex px-8 text-black flex-col ">
      <div className='w-full h-60 '>
        <div className='w-full h-15 bg-white rounded-md mb-4 p-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden'>
          <div className='w-1/5 h-full bg-blue-950 rounded-md flex items-center justify-center'>
            <div className='text-white font-bold text-center w-full h-full items-center p-2'>
              Luminosidade
              {dashboardFilterFinalData}
            </div>
          </div>
        </div>

        <CustomLineChart info="lum" />
        <div className='w-full h-min rounded-md mb-2 flex flex-row gap-4'>
          <CardsGrid info={"lum"}/>
          <div className='bg-white w-1/2 h-104 mt-4 rounded-md  '>
            <CustomList info="lum" />
          </div>
        </div>
      </div>
    </div>
  );
}