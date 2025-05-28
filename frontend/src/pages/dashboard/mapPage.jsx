import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import { useSensor } from '../../utils/contexts/SensorContext';
import { useReadingList } from '../../utils/contexts/ReadingListContext';
import { FaTemperatureHalf, FaSun, FaBatteryFull, FaFlask } from 'react-icons/fa6';

export default function MapPage() {
  const { setSelectedIndex } = useSidebar();
  const { userData } = useUser();
  const { fetchSensorData, sensorList } = useSensor();
  const { readingList } = useReadingList();

  useEffect(() => {
    setSelectedIndex(0);
  }, [setSelectedIndex]);

  useEffect(() => {
    fetchSensorData();
  }, []);

  const position = [-23.6785, -46.6639];

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sensorList.map((sensor) => (
            <Marker
              key={sensor.sensorId}
              position={[sensor.latitude, sensor.longitude]}
              riseOnHover={true}
            >
                {console.log(sensor)}
              <Popup>{sensor.name || sensor._id}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className='absolute h-[60%] w-[450px] right-[2%] top-1/4 z-[999] flex flex-col gap-4'>
        <div className="p-4 w-full bg-white text-2xl rounded-md flex flex-row">
          <div className='w-full p-2 rounded-md flex flex-row items-center justify-start text-2xl'>
            Sensores ativos
          </div>
          <div className='bg-blue-950 text-white p-2 rounded-md flex flex-row items-center justify-center w-1/6 text-4xl'>
            {sensorList.length}
          </div>
        </div>

        <div className='bg-white p-4 rounded-md flex flex-row items-center justify-center text-md'>
          Última leitura:
          <span className='text-white ml-2 bg-blue-950 px-2 py-1 rounded-sm'>
            {
              (() => {
                const firstSensorId = sensorList[0]?._id;
                const lastReading = readingList[firstSensorId]?.[0];
                return lastReading
                  ? new Date(lastReading.timestamp).toLocaleDateString('pt-BR', options)
                  : 'Sem leitura';
              })()
            }
          </span>
        </div>

        <div className="p-2 w-full bg-white rounded-md flex flex-col gap-2">
          {sensorList.map((sensor) => {
            const readings = readingList[sensor._id] || [];
            const latestReading = readings[0]; // assumindo leitura mais recente na posição 0

            return (
              <div
                key={sensor._id}
                className="p-2 w-full flex flex-row justify-between gap-2 border-2 rounded-md border-transparent hover:border-blue-950 hover:scale-101 transition-all duration-200 ease-in-out cursor-pointer group"
              >
                <div className="w-1/4">
                  {"Sensor #" + sensor._id.slice(-4)} {/* mostra os 4 últimos caracteres */}
                </div>
                <div className="w-1/6 flex flex-row items-center justify-end gap-1">
                  {latestReading?.ph ?? "-"}
                  <FaFlask size={18} className='text-blue-950 group-hover:rotate-[360] transition-all duration-200 ease-in' />
                </div>
                <div className="w-1/5 flex flex-row items-center justify-end gap-1">
                  {latestReading?.luminosity != null ? latestReading.luminosity + " %" : "-"}
                  <FaSun size={18} className='text-blue-950' />
                </div>
                <div className="w-1/5 flex flex-row items-center justify-end gap-1">
                  {latestReading?.temperature != null ? latestReading.temperature + " °C" : "-"}
                  <FaTemperatureHalf size={18} className='text-blue-950' />
                </div>
                <div className="w-1/5 flex flex-row items-center justify-end gap-1">
                  {latestReading?.batery != null ? latestReading.batery + " %" : "-"}
                  <FaBatteryFull size={18} className='text-blue-950' />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
