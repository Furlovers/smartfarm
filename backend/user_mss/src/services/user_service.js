import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

/*
Neste arquivo são definidas de fato as funcionalidades do microsserviço de usuário. Consiste nas funções
responsáveis por interagir diretamente com o banco de dados e com o barramento de eventos. Suas funções
são utilizadas pelo arquivo `controller` deste microsserviço. 
*/

export const getAllUsers = async () => await User.find();

export const getUserByUserId = async (userId) => {
  return await User.findOne({ userId });
};

export const createUser = async (data) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("Email já registrado");
    }

    // Criptografa a senha do usuário antes de armazenar no banco de dados
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const userData = {
      ...data,
      password: hashedPassword,
      userId: uuidv4(),
      dateOfJoining: Date.now(),
      role: "user-basic",
    };

    const newUser = new User(userData);
    await newUser.save();
    await axios.post("http://event-bus:3004/event", {
      type: "UserCreateView",
      data: {
        user_data: userData,
      },
    });

    const userObj = newUser.toObject();
    delete userObj.password;
    return userObj;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateUserByUserId = async (userId, data) => {
  try {
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate({ userId }, data, {
      new: true,
    });

    await axios.post("http://event-bus:3004/event", {
      type: "UserUpdateView",
      data: {
        user_data: updatedUser,
      },
      params: { userId: userId },
    });

    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addSensor = async (userId, sensorId) => {
  try {
    return await User.findOneAndUpdate(
      { userId },
      { $addToSet: { sensorList: sensorId } },
      { new: true }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeSensor = async (userId, sensorId) => {
  console.log(`Removing sensor ${sensorId} from user ${userId}`);
  try {
    return await User.findOneAndUpdate(
      { userId },
      { $pull: { sensorList: sensorId } },
      { new: true }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteUserByUserId = async (userId) => {
  try {
    const deleted = await User.findOneAndDelete({ userId });
    await axios.post("http://event-bus:3004/event", {
      type: "UserDeleteView",
      params: { userId: userId },
    });
    return deleted;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = bcrypt.compareSync(password, user.password);
  return isMatch ? user : null;
};
