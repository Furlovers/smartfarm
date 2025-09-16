import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/*

Especificação do Schema para a base de dados de Usuários. Sua chave primária é a userID.

*/

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user-basic', 'user-intermediary', 'user-premium', 'admin'], default: 'user-basic'},
  address: { type: String },
  dateOfJoining: { type: Number, default: Date.now },
  sensorList: { type: [String], default: [] }
});

export default mongoose.model('User', userSchema);
