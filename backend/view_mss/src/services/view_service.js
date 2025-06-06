import View from "../models/view_model.js";
import { v4 as uuidv4 } from "uuid";

/*
Neste arquivo são definidas de fato as funcionalidades do microsserviço de consulta. Consiste nas funções
responsáveis por interagir diretamente com o banco de dados e com o barramento de eventos. Suas funções
são utilizadas pelo arquivo `controller` deste microsserviço. 
*/

export const createUser = async (data) => {
  const defaultReading = {
    battery: 0,
    temperature: 0,
    humidity: 0,
    pH: 0,
    luminosity: 0,
    createdAt: Date.now(),
    readingId: uuidv4(),
  };

  const defaultSensor = {
    name: "undefined",
    latitude: 0,
    longitude: 0,
    createdAt: Date.now(),
    readingList: [defaultReading],
    sensorId: uuidv4(),
  };
  try {
    const newUser = new View({
      name: data.name,
      email: data.email,
      password: data.password,
      userId: data.userId,
      dateOfJoining: data.dateOfJoining,
      role: data.role,
      address: data.address || "",
      userId: data.userId,
      sensorList: [defaultSensor],
    });
    await newUser.save();
    return newUser;
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error(err.message);
  }
};

export const updateUser = async (userId, data) => {
  const defaultReading = {
    battery: 0,
    temperature: 0,
    humidity: 0,
    pH: 0,
    luminosity: 0,
    createdAt: Date.now(),
    readingId: uuidv4(),
  };

  const defaultSensor = {
    name: "undefined",
    latitude: 0,
    longitude: 0,
    createdAt: Date.now(),
    readingList: [defaultReading],
    sensorId: uuidv4(),
  };
  try {
    const updatedUser = await View.findOneAndUpdate(
      { userId },
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        address: data.address || "",
      },
      {
        new: true,
      }
    );

    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteUser = async (userId) => {
  const defaultReading = {
    battery: 0,
    temperature: 0,
    humidity: 0,
    pH: 0,
    luminosity: 0,
    createdAt: Date.now(),
    readingId: uuidv4(),
  };

  const defaultSensor = {
    name: "undefined",
    latitude: 0,
    longitude: 0,
    createdAt: Date.now(),
    readingList: [defaultReading],
    sensorId: uuidv4(),
  };
  try {
    const deleted = await View.findOneAndDelete({ userId });

    if (!deleted) {
      throw new Error("Usuário não encontrado");
    }
    return deleted;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const createSensor = async (userId, sensorData) => {
  const defaultReading = {
    battery: 0,
    temperature: 0,
    humidity: 0,
    pH: 0,
    luminosity: 0,
    createdAt: Date.now(),
    readingId: uuidv4(),
  };

  const defaultSensor = {
    name: "undefined",
    latitude: 0,
    longitude: 0,
    createdAt: Date.now(),
    readingList: [defaultReading],
    sensorId: uuidv4(),
  };
  try {
    const user = await View.findOne({ userId });
    const newSensor = {
      name: sensorData.name,
      latitude: sensorData.latitude,
      longitude: sensorData.longitude,
      createdAt: sensorData.createdAt,
      sensorId: sensorData.sensorId,
      readingList: [defaultReading],
    };

    user.sensorList.push(newSensor);
    await user.save();

    return newSensor;
  } catch (err) {
    console.error("Error creating sensor:", err);
    throw new Error(err.message);
  }
};

export const updateSensor = async (userId, sensorData) => {
  const defaultReading = {
    battery: 0,
    temperature: 0,
    humidity: 0,
    pH: 0,
    luminosity: 0,
    createdAt: Date.now(),
    readingId: uuidv4(),
  };

  const defaultSensor = {
    name: "undefined",
    latitude: 0,
    longitude: 0,
    createdAt: Date.now(),
    readingList: [defaultReading],
    sensorId: uuidv4(),
  };
  try {
    const user = await View.findOne({ userId }).select("sensorList");
    const sensor = user.sensorList.find(
      (s) => s.sensorId === sensorData.sensorId
    );
    sensor.name = sensorData.name || sensor.name;
    sensor.latitude = sensorData.latitude || sensor.latitude;
    sensor.longitude = sensorData.longitude || sensor.longitude;
    sensor.createdAt = sensorData.createdAt || sensor.createdAt;
    await user.save();
    return sensor;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteSensor = async (userId, sensorId) => {
  try {
    const user = await View.findOne({ userId }).select("sensorList");
    user.sensorList = user.sensorList.filter((s) => s.sensorId !== sensorId);
    await user.save();

    return user;
  } catch (err) {
    console.error("Error deleting sensor:", err);
    throw new Error(err.message);
  }
};

export const createReading = async (userId, sensorId, readingData) => {
  try {
    const user = await View.findOne({ userId }).select("sensorList");
    const sensor = user.sensorList.find((s) => s.sensorId === sensorId);
    const newReading = {
      battery: readingData.battery,
      temperature: readingData.temperature,
      humidity: readingData.humidity,
      pH: readingData.pH,
      luminosity: readingData.luminosity,
      createdAt: readingData.createdAt,
      readingId: readingData.readingId,
    };

    sensor.readingList.push(newReading);
    await user.save();
    return newReading;
  } catch (err) {
    console.error("Error creating reading:", err);
    throw new Error(err.message);
  }
};

export const updateReading = async (
  userId,
  sensorId,
  readingId,
  readingData
) => {
  try {
    const user = await View.findOne({ userId }).select("sensorList");
    const sensor = user.sensorList.find((s) => s.sensorId === sensorId);
    const reading = sensor.readingList.find((r) => r.readingId === readingId);
    reading.battery = readingData.battery || reading.battery;
    reading.temperature = readingData.temperature || reading.temperature;
    reading.humidity = readingData.humidity || reading.humidity;

    reading.pH = readingData.pH || reading.pH;
    reading.luminosity = readingData.luminosity || reading.luminosity;
    reading.createdAt = readingData.createdAt || reading.createdAt;

    await user.save();
    return reading;
  } catch (err) {
    console.error("Error updating reading:", err);
    throw new Error(err.message);
  }
};

export const deleteReading = async (userId, sensorId, readingId) => {
  try {
    const user = await View.findOne({ userId }).select("sensorList");
    const sensor = user.sensorList.find((s) => s.sensorId === sensorId);
    sensor.readingList = sensor.readingList.filter(
      (r) => r.readingId !== readingId
    );
    await user.save();
    return sensor;
  } catch (err) {
    console.error("Error deleting reading:", err);
    throw new Error(err.message);
  }
};

export const getUserView = async (userId) => {
  try {
    const user = await View.findOne({ userId });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    user.sensorList.forEach((sensor) => {
      if (sensor.readingList.length > 0) {
        sensor.readingList.shift();
      }
    });

    if (user.sensorList.length > 0) {
      user.sensorList.shift();
    }

    return user;
  } catch (err) {
    console.error("Error getting user view:", err);
    throw new Error(err.message);
  }
};
