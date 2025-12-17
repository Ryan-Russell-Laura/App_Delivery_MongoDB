import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select('-password');

    if (!usuario) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    req.user = usuario;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'Admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
  }
  next();
};

export const isCliente = (req, res, next) => {
  if (req.user.rol !== 'Cliente') {
    return res.status(403).json({ message: 'Acceso denegado. Solo clientes.' });
  }
  next();
};
