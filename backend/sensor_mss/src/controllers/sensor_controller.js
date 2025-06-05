import * as sensorService from "../services/sensor_service.js";
import axios from "axios";

export const getAllSensors = async (req, res) => {
  try {
    const sensors = await sensorService.getAllSensors();
    res.json(sensors);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Erro ao recuperar sensores: ${err.message}` });
  }
};

export const getSensorById = async (req, res) => {
  try {
    const sensor = await sensorService.getSensorById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor não encontrado" });
    }
    res.json(sensor);
  } catch (err) {
    res.status(500).json({
      message: `Erro ao recuperar sensor com ID ${req.params.id}: ${err.message}`,
    });
  }
};

export const createSensor = async (req, res) => {
  try {
    const newSensor = await sensorService.createSensor(
      {
        ...req.body,
        userId: req.user.id,
        createdAt: Date.now(),
      },
      req.user.id
    );
    axios.post(" https://smartfarm-event-bus-8f3176961794.herokuapp.com/event", {
      type: "SensorCreate",
      data: {
        user_id: req.user.id,
        sensor_id: newSensor.sensorId,
      },
    });
    res.status(201).json(newSensor);
  } catch (err) {
    res.status(400).json({ message: `Erro ao criar sensor: ${err.message}` });
  }
};

export const updateSensor = async (req, res) => {
  try {
    const updatedSensor = await sensorService.updateSensor(
      req.params.id,
      req.body,
      req.user.id
    );
    if (!updatedSensor) {
      return res.status(404).json({ message: "Sensor não encontrado" });
    }
    res.json(updatedSensor);
  } catch (err) {
    res.status(400).json({
      message: `Erro ao atualizar sensor com ID ${req.params.id}: ${err.message}`,
    });
  }
};

export const deleteSensor = async (req, res) => {
  try {
    const deletedSensor = await sensorService.deleteSensor(
      req.params.id,
      req.user.id
    );
    if (!deletedSensor) {
      return res.status(404).json({ message: "Sensor não encontrado" });
    }

    axios.post(" https://smartfarm-event-bus-8f3176961794.herokuapp.com/event", {
      type: "SensorDelete",
      data: {
        user_id: req.user.id,
        sensor_id: deletedSensor.sensorId,
      },
    });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      message: `Erro ao excluir sensor com ID ${req.params.id}: ${err.message}`,
    });
  }
};
