import { createContext, useContext, useState, useEffect } from "react";
import { sensorAPI } from "../constants/axios-instance";
import { useUser } from "./UserContext";

const SensorContext = createContext();

export function SensorProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sensorList, setSensorList] = useState([]);


    const { userData } = useUser();

  const fetchSensorData = async () => {
    try {
      setLoading(true)
    console.log(userData.sensorList);
      for( let i = 0; i < userData.sensorList.length; i++) {
        const sensor = userData.sensorList[i];
        const response = await sensorAPI.get(`/${sensor}`);
        setSensorList((prev) => [...prev, response.data]);
      }
      console.log(sensorList);
      setError(null);
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const value = {
    sensorList,
    loading,
    error,
    fetchSensorData,
  };

  return (
    <SensorContext.Provider value={value}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error("useSensor must be used within a SensorProvider");
  }
  return context;
}
