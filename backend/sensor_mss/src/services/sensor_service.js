import Sensor from "../models/sensor_model.js";
import axios from "axios";

export const getAllSensors = async () => await Sensor.find();

export const getSensorById = async (sensorId) => {
  return await Sensor.findOne({ sensorId });
};

export const createSensor = async (data, userId) => {
  const newSensor = new Sensor(data);
  await newSensor.save();
  await axios.post("https://smartfarm-event-bus-8f3176961794.herokuapp.com/event", {
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
  await axios.post("https://smartfarm-event-bus-8f3176961794.herokuapp.com/event", {
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
  await axios.post("https://smartfarm-event-bus-8f3176961794.herokuapp.com/event", {
    type: "SensorDeleteView",
    params: {
      userId: userId,
      sensorId: sensorId,
    },
  });

  return deletedSensor;
};
