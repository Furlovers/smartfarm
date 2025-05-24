import Reading from '../models/reading_model.js';

export const getAllReadings = async () => await Reading.find();

export const getReadingById = async (id) => await Reading.findById(id);

export const createReading = async (data) => {
  const newReading = new Reading(data);
  await newReading.save();
  return newReading.toObject();
};

export const updateReading = async (id, data) => {
  const updatedReading = await Reading.findByIdAndUpdate(id, data, { new: true });
  return updatedReading;
};

export const deleteReading = async (id) => await Reading.findByIdAndDelete(id);
