import { createContext, useContext, useState, useEffect } from "react";
import { useSensor } from "./SensorContext";
import { readingAPI } from "../constants/axios-instance";

const ReadingListContext = createContext();

export function ReadingListProvider({ children }) {
  const [readingList, setReadingList] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { sensorList } = useSensor();

  const fetchReadingList = async () => {
    try {
      setLoading(true);

      const responses = await Promise.all(
        sensorList.map((sensor) =>
          sensor.readingList.map((reading) => readingAPI.get(`/${reading}`))
        )
      );

      const readingsBySensor = {};
      responses.forEach((res, index) => {
        const sensorId = sensorList[index]._id;
        readingsBySensor[sensorId] = res.data;
      });
      setReadingList(readingsBySensor);

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar as leituras dos sensores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sensorList.length > 0) {
      fetchReadingList();
    }
  }, [sensorList]);

  const value = {
    readingList,
    loading,
    error,
    fetchReadingList,
  };

  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error("useReadingList must be used within a ReadingListProvider");
  }
  return context;
}
