  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';

  /*

Este arquivo tem a finalidade de gerenciar a sessão do usuário, verificando a partir de seu token 
de autenticação gerado durante o login. Também, verifica se um usuário tem permissão para interagir com o 
objeto desejado.

*/


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

  export const authorizeUserOrAdmin = (req, res, next) => {
      const { id, role } = req.user;
    
      if (role === 'admin') {
        return next(); 
      }
    
      if (req.params.id && req.params.id !== id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
    
      next();
    };
    
