import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSidebar } from "../../utils/contexts/SidebarContext";
import { useEffect, useState } from "react";
import { useUser } from "../../utils/contexts/UserContext";
import { useSensor } from "../../utils/contexts/SensorContext";
import {
  FaTemperatureHalf,
  FaSun,
  FaBatteryFull,
  FaFlask,
  FaX,
} from "react-icons/fa6";
import StyledInput from "../auth/components/styledInput.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { timestampToDate } from "../../utils/formatters/date-formatters.js";
import ConfirmationBox from "../../components/ConfirmationBox.jsx";

export default function MapPage() {
  const { setSelectedIndex } = useSidebar();
  const { userData, fetchUserData, loading } = useUser();
  const { createSensor, deleteSensor } = useSensor();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [sensorName, setSensorName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState(null);

  useEffect(() => {
    setSelectedIndex(0);
    fetchUserData();
  }, []);

  if (loading || userData === null) {
    return <LoadingScreen />;
  }

  const position = userData.sensorList[0]
    ? [userData.sensorList[0].latitude, userData.sensorList[0].longitude]
    : [-23.6785, -46.6639];

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

async function CreateSensor() {

  const newSensor = {
    name: sensorName.trim(),
    latitude: +latitude,
    longitude: +longitude,
  };

  try {
    await createSensor(newSensor);

    await fetchUserData();       
  } catch (e) {
    alert("Erro ao criar sensor");
    console.error(e);
    return;                    
  }

  setSensorName("");
  setLatitude("");
  setLongitude("");
  setIsPopupOpen(false);
}


  function handleDeleteSensor() {
    console.log("Deleting sensor:", sensorToDelete);
    deleteSensor(sensorToDelete).then(() => {
      fetchUserData();
      setConfirmOpen(false);
      setSensorToDelete(null);
    });
  }

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
          {userData?.sensorList?.map((sensor) => (
            <Marker
              key={sensor.sensorId || sensor._id}
              position={[sensor.latitude, sensor.longitude]}
              riseOnHover={true}
            >
              <Popup>{sensor.name || "Sensor #" + sensor._id?.slice(-4)}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="absolute h-[60%] w-[450px] right-[2%] top-[10%] z-[999] flex flex-col gap-4">
        <div className="p-4 w-full bg-white text-2xl rounded-md flex flex-row">
          <div className="w-full p-2 rounded-md flex flex-row items-center justify-start text-2xl">
            Sensores ativos
          </div>
          <div className="bg-blue-950 text-white p-2 rounded-md flex flex-row items-center justify-center w-1/6 text-4xl">
            {userData?.sensorList?.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md flex flex-row items-center justify-center text-md">
          Última leitura:
          <span className="text-white ml-2 bg-blue-950 px-2 py-1 rounded-sm">
            {(() => {
              const lastReading =
                userData?.sensorList[0]?.readingList[
                  userData?.sensorList[0]?.readingList.length - 1
                ];
              return timestampToDate(lastReading?.createdAt);
            })()}
          </span>
        </div>

        <div className="p-2 w-full bg-white rounded-md flex flex-col gap-2">
          <div
            onClick={() => setIsPopupOpen(true)}
            className="w-full h-8 bg-blue-950 text-white rounded-sm flex flex-row items-center justify-center text-md hover:bg-white hover:text-blue-950 font-bold hover:border-blue-950 hover:scale-101 transition-all duration-200 ease-in-out cursor-pointer border-2 border-transparent"
          >
            Adicionar sensor
          </div>

          <div className="overflow-y-auto max-h-[490px]">
            {userData.sensorList.map((sensor) => {
              const readings = userData.sensorList?.readingList || [];
              const latestReading =
                userData?.sensorList[0]?.readingList[
                  userData?.sensorList[0]?.readingList.length - 1
                ];

              return (
                <div
                  key={sensor._id}
                  className="p-2 w-full flex flex-row justify-between gap-2 border-2 rounded-md border-transparent hover:border-blue-950 transition-all duration-200 ease-in-out cursor-pointer group"
                >
                  <div className="w-1/4">
                    {sensor.name || "Sensor #" + sensor._id?.slice(-4)}
                  </div>
                  <div className="w-1/6 flex flex-row items-center justify-end gap-1">
                    {latestReading?.pH ?? "-"}
                    <FaFlask
                      size={18}
                      className="text-blue-950 group-hover:rotate-[360] transition-all duration-200 ease-in"
                    />
                  </div>
                  <div className="w-1/5 flex flex-row items-center justify-end gap-1">
                    {latestReading?.luminosity != null
                      ? latestReading.luminosity + " %"
                      : "-"}
                    <FaSun size={18} className="text-blue-950" />
                  </div>
                  <div className="w-1/5 flex flex-row items-center justify-end gap-1">
                    {latestReading?.temperature != null
                      ? latestReading.temperature + " °C"
                      : "-"}
                    <FaTemperatureHalf size={18} className="text-blue-950" />
                  </div>
                  <div
                    className="w-1/5 flex flex-row items-center justify-end gap-1 text-blue-950 cursor-pointer"
                    onClick={() => {
                      setSensorToDelete(sensor.sensorId);
                      setConfirmOpen(true);
                    }}
                    title="Remover sensor"
                  >
                    <FaX size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className={`absolute z-[1000] top-0 h-full w-full`}>
          <div
            onClick={() => setIsPopupOpen(false)}
            className="absolute h-full w-full bg-black opacity-75"
          ></div>
          <div className="absolute rounded-md h-[30%] w-[450px] left-[30%] top-1/3 z-[999] flex flex-col gap-4 bg-white p-4">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-8 text-2xl text-blue-950 font-bold">
                Adicionar sensor
              </div>
              <StyledInput
                type="text"
                placeholder="Nome do sensor"
                onChange={setSensorName}
                value={sensorName}
              />
              <div className="w-full flex flex-row items-center justify-between gap-2">
                <StyledInput
                  type="text"
                  value={latitude}
                  placeholder="Latitude"
                  onChange={setLatitude}
                />
                <StyledInput
                  type="text"
                  value={longitude}
                  placeholder="Longitude"
                  onChange={setLongitude}
                />
              </div>
              <div
                onClick={CreateSensor}
                className="w-full h-15 hover:bg-white hover:border-blue-950 border-2 border-transparent hover:text-blue-950 font-bold cursor-pointer bg-blue-950 text-white mt-8 flex items-center justify-center rounded-sm"
              >
                Adicionar Sensor
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmOpen && (
        <ConfirmationBox
          message="Tem certeza que deseja excluir este sensor?"
          onConfirm={handleDeleteSensor}
          onCancel={() => {
            setConfirmOpen(false);
            setSensorToDelete(null);
          }}
        />
      )}
    </div>
  );
}
