import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Reading from "../models/reading_model.js";

/*

Este arquivo tem a finalidade de gerenciar a sessão do usuário, verificando a partir de seu token 
de autenticação gerado durante o login. Também, verifica se um usuário tem permissão para interagir com o 
objeto desejado.

*/

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token inválido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    req.user = user;
    next();
  });
};

export const authorizeReadingUserOrAdmin = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const readingId = req.params.id;

    if (role === "admin") {
      return next();
    }

    const reading = await Reading.findOne({ readingId: readingId });

    next();
  } catch (err) {
    res.status(500).json({ message: `Erro na autorização: ${err.message}` });
  }
};
