import * as viewService from '../services/view_service.js';

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
    res.status(400).json({ message: `Erro ao atualizar usuário: ${err.message}` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await viewService.deleteUser(userId);
    res.status(204).send(); 
  } catch (err) {
    res.status(400).json({ message: `Erro ao deletar usuário: ${err.message}` });
  }
};
