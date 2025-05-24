  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';
  import Reading from '../models/reading_model.js';

  dotenv.config();

  export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'Token inválido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });

      req.user = user; 
      next();
    });
  };

  export const authorizeReadingUserOrAdmin = async (req, res, next) => {
    try {
    const readingId = req.params.id;
    const sensorId = req.body.sensor_id;

    if (role === 'admin') {
      return next();
    }

    const reading = await Reading.findById(readingId);

    if (reading.sensorId.toString() !== sensorId) {
      return res.status(403).json({ message: 'Acesso negado: sensor pertence a outro usuário.' });
    }

    next();
    } catch (err) {
      res.status(500).json({ message: `Erro na autorização: ${err.message}` });
    }
  }
    
