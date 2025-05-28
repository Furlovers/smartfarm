import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { useSidebar } from '../../utils/contexts/SidebarContext';
import { useEffect } from 'react';
import { useUser } from '../../utils/contexts/UserContext';
import { useSensor } from '../../utils/contexts/SensorContext';
import { useReadingList } from '../../utils/contexts/ReadingListContext';
import { FaTemperatureHalf, FaSun, FaBatteryFull, FaFlask } from 'react-icons/fa6';
import { useState } from 'react';
import StyledInput from '../auth/components/styledInput.jsx'

export default function MapPage() {
    const { setSelectedIndex } = useSidebar()
    const { userData } = useUser()
    const [ isPopupOpen, setIsPopupOpen  ]= useState(false)
    const [ sensorName, setSensorName ] = useState("")
    const [ latitude, setLatitude ] = useState("")
    const [ longitude, setLongitude ] = useState("")
    
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

    function CreateSensor() {

        // Variável de verificação de nome de sensor
        let doesSensorExist = false

        // Loop que verifica se o nome do sensor já existe nos sensores ativos
        userData.sensors.forEach(sensor => {
            if (sensor.name === sensorName) {
                alert("Sensor já existe")
                doesSensorExist = true
                return
            } 
        });

        // Se o sensor já existe, não cria um novo sensor
        if (doesSensorExist) {
            return
        } else {
            // Se o sensor não existe, cria um novo sensor adicionando na lista
            userData.sensors.push({
                    id: userData.sensors.length + 1,
                    name: sensorName,
                    latitude: latitude,
                    longitude: longitude,
                    readings: [
                        {
                            // Adicionando a data atual
                            data: new Date(),
                            ph: 0,
                            temperature: 0,
                            luminosity: 0,
                            batery: 0
                        }
                    ]
                })
            // Limpa os campos de entrada, do contrário 
            // quando abrir o popup novamente, 
            // os campos estarão preenchidos com os dados anteriores
            setSensorName("")
            setLatitude("")
            setLongitude("")
        }
        setIsPopupOpen(false)

    }
 

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
            
            <div className='absolute min-h-[60%] max-h-[80%] w-[450px]  right-[2%] top-[10%] z-[999] flex flex-col gap-4 '>
                
                <div className="p-4  w-full bg-white text-2xl rounded-md flex flex-row">
                  
                  <div className='w-full p-2 rounded-md flex flex-row items-center justify-start text-2xl'>
                Sensores ativos
                  </div>
                  <div className='bg-blue-950 text-white p-2 rounded-md flex flex-row items-center justify-center w-1/6 text-4xl'>
                {userData.sensors.length}
                  </div>
                </div>
                <div className='bg-white p-4 rounded-md flex flex-row items-center justify-center text-md'>
                    {"Data da última leitura: "} <a className=' text-white ml-2 bg-blue-950 px-2 py-1 rounded-sm'>{userData.sensors[userData.sensors.length - 1].readings[userData.sensors[userData.sensors.length - 1].readings.length - 1].data.toLocaleDateString('pt-BR', options)}</a>
                </div>
                <div  className="p-2  w-full bg-white rounded-md flex flex-col gap-2  ">
                    <div onClick={() => setIsPopupOpen(true)}  className='w-full h-8 bg-blue-950 text-white rounded-sm flex flex-row items-center justify-center text-md hover:bg-white hover:text-blue-950 font-bold hover:border-blue-950 hover:scale-101 transition-all duration-200 ease-in-out cursor-pointer hover:font-bold border-2 border-transparent '>
                        Adicionar sensor
                    </div>

                <div className='overflow-y-auto max-h-[490px]'>
                {userData.sensors.map((sensor, index) => {
                    return (
                        <div className="p-2 w-full flex flex-row space-between gap-2 border-2 rounded-md border-transparent hover:border-blue-950 transition-all duration-200 ease-in-out cursor-pointer group" key={index}>
                            <div className="w-1/4">
                                {sensor.name}
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
            </div>
            { isPopupOpen &&
            <div className={`absolute z-[1000]  top-0 h-full w-full`}>
                <div onClick={() => setIsPopupOpen(false)} className='absolute h-full w-full bg-black opacity-75'></div>
                <div className='absolute rounded-md h-[30%] w-[450px]  left-[30%] top-1/3 z-[999] flex flex-col gap-4 bg-white p-4'>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <div className='mb-8 text-2xl text-blue-950 font-bold'>
                            Adicionar sensor
                        </div>
                        <StyledInput type={"text"}  placeholder={"Nome do sensor"} onChange={setSensorName} value={sensorName} />
                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                        <StyledInput type={"text"} value={latitude} placeholder={"Latitude"} onChange={setLatitude}/>
                        <StyledInput type={"text"} value={longitude} placeholder={"Longitude"} onChange={setLongitude}/>
                        </div>
                        <div onClick={() => CreateSensor(sensorName, latitude, longitude)} className='w-full h-15 hover:bg-white hover:border-blue-950 border-2 border-transparent hover:text-blue-950 font-bold cursor-pointer bg-blue-950 text-white mt-8 flex items-center justify-center rounded-sm'>
                            Adicionar Sensor
                        </div>
                    </div>
                </div>

            </div>}

        </div>
    )
}
