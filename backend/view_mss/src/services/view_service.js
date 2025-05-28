import View from '../models/view_model.js';

export const createUser = async (data) => {
  try {
    const newUser = new View(data);
    await newUser.save();
    return newUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateUser = async (userId, data) => {
  try {
    console.log(data)
    const updatedUser = await View.findOneAndUpdate({ userId }, {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      address: data.address || "",
    }, {
      new: true, 
    });

    if (!updatedUser) {
      throw new Error('Usuário não encontrado');
    }

    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteUser = async (userId) => {
  try {
    const deleted = await View.findOneAndDelete({ userId });

    if (!deleted) {
      throw new Error('Usuário não encontrado');
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
