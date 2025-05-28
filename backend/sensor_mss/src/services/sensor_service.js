import Sensor from '../models/sensor_model.js';

export const getAllSensors = async () => await Sensor.find();

export const getSensorById = async (sensorId) => {
  return await Sensor.findOne({ sensorId });
}

export const createSensor = async (data) => {
  const newSensor = new Sensor(data);
  await newSensor.save();
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

export const updateSensor = async (id, data) => {
  const updatedSensor = await Sensor.findByIdAndUpdate(id, data, { new: true });
  return updatedSensor;
};

export const deleteSensor = async (sensorId) => {
  return await Sensor.findOneAndDelete({ sensorId: sensorId })
}

