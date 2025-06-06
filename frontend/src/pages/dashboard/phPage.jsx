import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import CustomLineChart from './components/linechart/linechart';
import CustomList from './components/list/customList';
import LoadingScreen from '../../components/LoadingScreen';
import CardsGrid from '../../components/infoCards/cardsGrid';
import { FaArrowRight } from 'react-icons/fa6';
import logo from '../../assets/logo.png'

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

  const initialDate = new Date(userData.sensorList[0].readingList[0].createdAt);
  initialDate.setMinutes(initialDate.getMinutes() + initialDate.getTimezoneOffset());
  const formatedInitialDate = initialDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const finalDate = new Date(userData.sensorList[0].readingList[userData.sensorList[0].readingList.length - 1].createdAt);
  finalDate.setMinutes(finalDate.getMinutes() + finalDate.getTimezoneOffset());
  const formatedFinalDate = finalDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="w-full h-full flex px-8 text-black flex-col">
      <div className='w-full h-60'>
        <div className='w-full h-15 bg-white rounded-md mb-4 p-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex items-center justify-between'>
          <div className='w-1/5 h-full bg-blue-950 rounded-md flex items-center justify-center'>
            <div className='text-white font-bold text-center flex items-center justify-center gap-2'>
              {formatedInitialDate} <FaArrowRight size={15}/> {formatedFinalDate}
              {dashboardFilterFinalData}
            </div>
          </div>
          <img src={logo} alt="Logo Mauá SmartFarm" className="h-10 mr-4" />
        </div>

        <CustomLineChart info="ph" />

        <div className='w-full h-100 rounded-md mb-2 flex flex-row gap-4'>
          <CardsGrid info="ph"/>
          <div className='bg-white w-1/2 h-104 mt-4 rounded-md'>
            <CustomList info="ph" />
          </div>
        </div>
      </div>
    </div>
  );
}