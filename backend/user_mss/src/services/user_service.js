import User from '../models/user_model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const getAllUsers = async () => await User.find();

export const getUserByUserId = async (userId) => {
  return await User.findOne({ userId });
};

export const createUser = async (data) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email já registrado');
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const userData = {
      ...data,
      password: hashedPassword,
      userId: uuidv4(),
      dateOfJoining: Date.now(),
      role: 'user-basic'
    };

    const newUser = new User(userData);
    await newUser.save();
    await axios.post("http://localhost:3003/view/create_user", userData)

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

    const updatedUser = await User.findOneAndUpdate({ userId }, data, { new: true });

     await axios.put(`http://localhost:3003/view/update_user/${userId}`, updatedUser)

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
  }
  catch (err) {
    throw new Error(err.message);
  }
}

export const deleteUserByUserId = async (userId) => {
  try {
    const deleted = await User.findOneAndDelete({ userId });
    await axios.delete(`http://localhost:3003/view/delete_user/${userId}`);
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
