import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import CustomLineChart from './components/linechart/linechart';
import CustomList from './components/list/customList';
import LoadingScreen from '../../components/LoadingScreen';
import CardsGrid from '../../components/infoCards/cardsGrid';

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
    <div className="w-full h-full flex px-8 text-black flex-col">
      <div className='w-full h-60'>
        <div className='w-full h-15 bg-white rounded-md mb-4 p-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden'>
          <div className='w-1/5 h-full bg-blue-950 rounded-md flex items-center justify-center'>
            <div className='text-white font-bold text-center w-full h-full items-center p-2'>
              Valor de pH
              {dashboardFilterFinalData}
            </div>
          </div>
        </div>

        <CustomLineChart info="ph" />

        <div className='w-full h-100 rounded-md mb-2 flex flex-row gap-4'>
          <CardsGrid info="ph"/>

          {/* Custom list */}
          <div className='bg-white w-1/2 h-104 mt-4 rounded-md'>
            <CustomList info="ph" />
          </div>
        </div>
      </div>
    </div>
  );
}