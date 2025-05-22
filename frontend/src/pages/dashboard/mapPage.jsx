import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import { FaTemperatureHalf, FaSun, FaBatteryFull, FaFlask } from 'react-icons/fa6';
import { useState } from 'react';

export default function MapPage() {
    const { setSelectedIndex } = useSidebar()
    const { userData } = useUser()
    const [ isPopupOpen, setIsPopupOpen  ]= useState(false)
    

    useEffect(() => {
        setSelectedIndex(0)
    }, [setSelectedIndex])

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

 

    const position = [-23.6785, -46.6639]

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
                    {userData.sensors.map((sensor) => (
                        <Marker key={sensor.id} position={[sensor.latitude, sensor.longitude]} riseOnHover={true}>
                            <Popup>
                                {sensor.id}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            
            <div className='absolute h-[60%] w-[450px]  right-[2%] top-1/4 z-[999] flex flex-col gap-4 '>
                
                <div className="p-4  w-full bg-white text-2xl rounded-md flex flex-row">
                  
                  <div className='w-full p-2 rounded-md flex flex-row items-center justify-start text-2xl'>
                Sensores ativos
                  </div>
                  <div className='bg-blue-950 text-white p-2 rounded-md flex flex-row items-center justify-center w-1/6 text-4xl'>
                {userData.sensors.length}
                  </div>
                </div>
                <div className='bg-white p-4 rounded-md flex flex-row items-center justify-center text-md'>
                    {"Data da última leitura: "} <a className=' text-white ml-2 bg-blue-950 px-2 py-1 rounded-sm'>{userData.sensors[0].readings[0].data.toLocaleDateString('pt-BR', options)}</a>
                </div>
                <div onClick={() => setIsPopupOpen(true)} className="p-2  w-full bg-white rounded-md flex flex-col gap-2">
                    <div  className='w-full h-8 bg-blue-950 text-white rounded-sm flex flex-row items-center justify-center text-md hover:bg-white hover:text-blue-950 font-bold hover:border-blue-950 hover:scale-101 transition-all duration-200 ease-in-out cursor-pointer hover:font-bold border-2 border-transparent'>
                        Adicionar sensor
                    </div>
                    
                {userData.sensors.map((sensor, index) => {
                    return (
                        <div className="p-2 w-full flex flex-row space-between gap-2 border-2 rounded-md border-transparent hover:border-blue-950 hover:scale-101 transition-all duration-200 ease-in-out cursor-pointer group" key={index}>
                            <div className="w-1/4 ">
                                {"Sensor #" + sensor.id}
                            </div>
                            <div className="w-1/6 flex flex-row items-center justify-end gap-1">
                                {sensor.readings[0].ph}
                                <FaFlask size={18} className='text-blue-950 group-hover:rotate-[360] transition-all duration-200 ease-in'/>
                            </div>
                            <div className="w-1/5 flex flex-row items-center justify-end gap-1">
                                {sensor.readings[0].luminosity + " %"}
                                <FaSun size={18} className='text-blue-950'/>
                            </div>
                            <div className="w-1/5 flex flex-row items-center justify-end gap-1">
                                {sensor.readings[0].temperature + " °C"}
                                <FaTemperatureHalf size={18} className='text-blue-950'/>
                            </div>  
                            <div className="w-1/5  flex flex-row items-center justify-end gap-1">
                                {sensor.readings[0].batery + " %"}
                                <FaBatteryFull size={18} className='text-blue-950'/>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
            { isPopupOpen &&
            <div className={`absolute z-[1000]  top-0 h-full w-full`}>
                <div onClick={() => setIsPopupOpen(false)} className='absolute h-full w-full bg-black opacity-75'></div>
                <div className='absolute rounded-md h-[60%] w-[450px]  left-[30%] top-1/5 z-[999] flex flex-col gap-4 bg-white'>
                    
                </div>

            </div>}

        </div>
    )
}
