import * as viewService from "../services/view_service.js";

/*

Este arquivo tem a finalidade de tratar as requisições vindas do frontend para o microsserviço de consultas.
Arquiteturalmente, é a camada do backend mais próxima do frontend. Realiza a interpretação dos status codes,
trata possíveis erros, e faz a chamada dos outros microsserviços necessários para atender a requisição.

*/

export const createUser = async (req, res) => {
  try {
    const newUser = await viewService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: `Erro ao criar usuário: ${err.message}` });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await viewService.updateUser(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erro ao atualizar usuário: ${err.message}` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await viewService.deleteUser(userId);
    res.status(204).send();
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erro ao deletar usuário: ${err.message}` });
  }
};

export const createSensor = async (req, res) => {
  try {
    const { userId } = req.params;
    const newSensor = await viewService.createSensor(userId, req.body);
    res.status(201).json(newSensor);
  } catch (err) {
    res.status(400).json({ message: `Erro ao criar sensor: ${err.message}` });
  }
};

export const updateSensor = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedSensor = await viewService.updateSensor(userId, req.body);
    res.status(200).json(updatedSensor);
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erro ao atualizar sensor: ${err.message}` });
  }
};

export const deleteSensor = async (req, res) => {
  try {
    const { userId, sensorId } = req.params;
    await viewService.deleteSensor(userId, sensorId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: `Erro ao deletar sensor: ${err.message}` });
  }
};

export const createReading = async (req, res) => {
  try {
    const { userId, sensorId } = req.params;
    const newReading = await viewService.createReading(
      userId,
      sensorId,
      req.body
    );
    res.status(201).json(newReading);
  } catch (err) {
    res.status(400).json({ message: `Erro ao criar leitura: ${err.message}` });
  }
};

export const updateReading = async (req, res) => {
  try {
    const { userId, sensorId, readingId } = req.params;
    console.log(req.params);
    const updatedReading = await viewService.updateReading(
      userId,
      sensorId,
      readingId,
      req.body
    );
    res.status(200).json(updatedReading);
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erro ao atualizar leitura: ${err.message}` });
  }
};

export const deleteReading = async (req, res) => {
  try {
    const { userId, sensorId, readingId } = req.params;
    await viewService.deleteReading(userId, sensorId, readingId);
    res.status(204).send();
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erro ao deletar leitura: ${err.message}` });
  }
};

export const getUserView = async (req, res) => {
  try {
    const { userId } = req.params;
    const userView = await viewService.getUserView(userId);
    res.status(200).json(userView);
  } catch (err) {
    res
      .status(404)
      .json({ message: `Erro ao buscar view do usuário: ${err.message}` });
  }
};
