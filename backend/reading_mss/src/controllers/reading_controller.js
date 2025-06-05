import * as readingService from "../services/reading_service.js";
import axios from "axios";

export const getAllReadings = async (req, res) => {
  try {
    const readings = await readingService.getAllReadings();
    res.json(readings);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Erro requisitando as leituras: ${err.message}` });
  }
};

export const getReadingById = async (req, res) => {
  try {
    const reading = await readingService.getReadingById(req.params.id);
    if (!reading) {
      return res.status(404).json({ message: "Leitura não encontrada" });
    }
    res.json(reading);
  } catch (err) {
    res.status(500).json({
      message: `Erro requisitando a leitura com o id ${req.params.id}: ${err.message}`,
    });
  }
};

export const createReading = async (req, res) => {
  try {
    const newReading = await readingService.createReading(
      req.body,
      req.user.id
    );
    axios.post(" https://smartfarm-event-bus-8f3176961794.herokuapp.com/event", {
      type: "ReadingCreate",
      data: {
        reading_id: req.user.id,
        sensor_id: req.body.sensorId,
      },
    });
    res.status(201).json(newReading);
  } catch (err) {
    res.status(400).json({ message: `Erro criando leitura: ${err.message}` });
  }
};

export const updateReading = async (req, res) => {
  try {
    console.log(req.params.id, req.user.id);
    const updatedReading = await readingService.updateReading(
      req.params.id,
      req.body,
      req.user.id,
      req.params.sensorId
    );
    if (!updatedReading) {
      return res.status(404).json({ message: "Leitura não encontrada" });
    }
    res.json(updatedReading);
  } catch (err) {
    res.status(400).json({
      message: `Erro atualizando a leitura com o id ${req.params.id}: ${err.message}`,
    });
  }
};

export const deleteReading = async (req, res) => {
  try {
    const deletedReading = await readingService.deleteReading(
      req.params.id,
      req.params.sensorId,
      req.user.id
    );
    if (!deletedReading) {
      return res.status(404).json({ message: "Leitura não encontrada" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      message: `Erro deletando a leitura com o id ${req.params.id}: ${err.message}`,
    });
  }
};
