import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const readingSchema = new mongoose.Schema({
  readingId: { type: String, default: uuidv4, unique: true },
  battery: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  pH: { type: Number, required: true },
  luminosity: { type: Number, required: true },
  createdAt: { type: Number, required: true },
  sensorId: { type: String, ref: 'Sensor', required: true }
});

const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  userId: { type: String, ref: 'User', required: true }, 
  createdAt: { type: Number, required: true },
  readingList: {
    type: [readingSchema],
    default: []
  }
});

const viewSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user-basic', 'user-intermediary', 'user-premium', 'admin'], default: 'user-basic'},
  address: { type: String },
  dateOfJoining: { type: Number, default: Date.now },
  sensorList: {
    type: [sensorSchema],
    default: []
  }
});

export default mongoose.model('View', viewSchema);
