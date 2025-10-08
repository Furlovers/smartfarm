import Sensor from "../models/sensor_model.js";
import axios from "axios";

/*
Neste arquivo são definidas de fato as funcionalidades do microsserviço de sensores. Consiste nas funções
responsáveis por interagir diretamente com o banco de dados e com o barramento de eventos. Suas funções
são utilizadas pelo arquivo `controller` deste microsserviço. 
*/

export const getAllSensors = async () => await Sensor.find();

export const getSensorById = async (sensorId) => {
  return await Sensor.findOne({ sensorId });
};

export const createSensor = async (data, userId) => {
  const newSensor = new Sensor(data);
  await newSensor.save();
  await axios.post("http://event-bus:3004/event", {
    type: "SensorCreateView",
    data: {
      sensor_data: newSensor,
    },
    params: {
      userId: userId,
    },
  });
  return newSensor.toObject();
};

export const addReading = async (sensorId, readingId) => {
  try {
    return await Sensor.findOneAndUpdate(
      { sensorId },
      { $addToSet: { readingList: readingId } },
      { new: true }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateSensor = async (sensorId, data, userId) => {
  const updatedSensor = await Sensor.findOneAndUpdate({ sensorId }, data, {
    new: true,
  });
  if (!updatedSensor) {
    throw new Error("Sensor não encontrado");
  }
  await axios.post("http://event-bus:3004/event", {
    type: "SensorUpdateView",
    data: {
      sensor_data: updatedSensor,
    },
    params: {
      userId: userId,
    },
  });
  return updatedSensor;
};

export const deleteSensor = async (sensorId, userId) => {
  const deletedSensor = await Sensor.findOneAndDelete({ sensorId: sensorId });
  if (!deletedSensor) {
    throw new Error("Sensor não encontrado");
  }
  await axios.post("http://event-bus:3004/event", {
    type: "SensorDeleteView",
    params: {
      userId: userId,
      sensorId: sensorId,
    },
  });

  return deletedSensor;
};
