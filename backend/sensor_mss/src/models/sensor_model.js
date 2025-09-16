import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

/*

Especificação do Schema para a base de dados de Sensores. Sua chave primária é a senorID e possui a chave
estrangeira userID.

*/


const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  userId: { type: String, ref: 'User', required: true }, 
  createdAt: { type: Number, required: true },
  readingList: { type: [String], default: []}
});

export default mongoose.model('Sensor', sensorSchema);
