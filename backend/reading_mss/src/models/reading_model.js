import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/*

Especificação do Schema para a base de dados de Leitura. Sua chave primária é a readingID e possui a chave
estrangeira sensorID.

*/

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

export default mongoose.model('Reading', readingSchema);
