import mongoose from 'mongoose';
import User from './user_model.js'

// Conexão com o DB 
mongoose.connect('mongodb+srv://baguncadomonstrao:%23CabecaDoVandeco%40321@cluster-smartfarm.xailfpc.mongodb.net/smartfarm?retryWrites=true&w=majority&appName=Cluster-SmartFarm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Dados mockados
const mockUsers = [
  {
    name: "Carla Teste",
    email: "carla@email.com",
    password: bcrypt.hashSync("123456", 10),
    address: "Rua dos Testes, 123",
    userId: uuidv4(),
    dateOfJoining: Date.now(),
    sensors: []
  },
  {
    name: "Admin Silva",
    email: "admin@email.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    address: "Av. MongoDB, 456",
    userId: uuidv4(),
    dateOfJoining: Date.now(),
    sensors: []
  },
  {
    name: "Produtor João",
    email: "joao@fazenda.com",
    password: bcrypt.hashSync("agricultura123", 10),
    address: "Fazenda Feliz, Zona Rural",
    userId: uuidv4(),
    dateOfJoining: Date.now(),
    sensors: []
  }
];

// Função para inserir os dados
async function insertMockUsers() {
  try {
    await User.deleteMany({});
    await User.insertMany(mockUsers);
    console.log('Dados mockados inseridos com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir dados:', err);
  } finally {
    mongoose.disconnect();
  }
}

insertMockUsers();