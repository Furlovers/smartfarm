import * as userService from '../services/user_service.js';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: `Erro ao recuperar usuários: ${err.message}` });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserByUserId(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: `Erro ao recuperar usuário com ID ${req.params.id}: ${err.message}` });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: `Erro ao criar usuário: ${err.message}` });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserByUserId(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: `Erro ao atualizar usuário com ID ${req.params.id}: ${err.message}` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUserByUserId(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: `Erro ao excluir usuário com ID ${req.params.id}: ${err.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const user = await userService.login(req.body.email, req.body.password);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password, ...userWithoutPassword } = user.toObject();
    res.json({ message: 'Login bem-sucedido', token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: `Erro no login: ${err.message}` });
  }
};
