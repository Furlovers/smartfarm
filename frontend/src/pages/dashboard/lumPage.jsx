import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect, useState } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import CustomLineChart from './components/linechart/linechart';
import CustomList from './components/list/customList';
import AverageInfoCard from '../../components/infoCards/averageInfoCard';
import LoadingScreen from '../../components/LoadingScreen';
import CardsGrid from '../../components/infoCards/cardsGrid';
import logo from '../../assets/logo.png';

export default function LumPage() {
  const { setSelectedIndex } = useSidebar();
  const { userData, fetchUserData, loading } = useUser();
  const [selectedSensorIds, setSelectedSensorIds] = useState([]);

  useEffect(() => {
    fetchUserData();
    setSelectedIndex(1);
  }, []);

  if (loading || userData === null) {
    return <LoadingScreen />;
  }

  const filteredSensors = userData.sensorList.filter(sensor =>
    selectedSensorIds.includes(sensor._id));


  const handleSensorToggle = (sensorId) => {
    setSelectedSensorIds(prev =>
      prev.includes(sensorId)
        ? prev.filter(id => id !== sensorId)
        : [...prev, sensorId]
    );
  };

  return (
    <div className="w-full h-full flex px-8 text-black flex-col ">
      <div className='w-full h-60 '>
        <div className='w-full h-15 bg-white rounded-md mb-4 p-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex items-center justify-between'>
          <div className='w-1/5 h-full bg-blue-950 rounded-md flex items-center justify-center'>
            <div className='text-white font-bold text-center flex items-center justify-center gap-2'>
               Luminosidade
            </div>
          </div>
          <img src={logo} alt="Logo Mauá SmartFarm" className="h-10 mr-4" />
        </div>

        <div className="mb-4 bg-white rounded-md p-3 shadow-sm hover:shadow-lg w-full">
          <span className="font-bold mb-2 block">
            Filtrar por sensores:
          </span>
          <div className="flex flex-wrap gap-2">
            {userData.sensorList.map(sensor => (
              <button
                key={sensor._id}
                onClick={() => handleSensorToggle(sensor._id)}
                className={`px-3 py-1 rounded-full border text-sm ${selectedSensorIds.includes(sensor._id)
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-gray-200 text-gray-800 border-gray-400'
                }`}
              >
                {sensor.name}
              </button>
            ))}
          </div>
        </div>

        <CustomLineChart info="lum" filteredSensors={filteredSensors} />
        <div className="w-full h-min rounded-md mb-2 flex flex-row gap-4">
          <CardsGrid info="lum" filteredSensors={filteredSensors} />
          <div className="bg-white w-1/2 h-104 mt-4 rounded-md">
            <CustomList info="lum" filteredSensors={filteredSensors} />
          </div>
        </div>
      </div>
    </div>
  );
}