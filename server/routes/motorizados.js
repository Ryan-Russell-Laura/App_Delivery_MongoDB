import express from 'express';
import Motorizado from '../models/Motorizado.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const motorizados = await Motorizado.find().sort({ createdAt: -1 });
    res.json(motorizados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener motorizados', error: error.message });
  }
});

router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const motorizado = await Motorizado.findById(req.params.id);
    if (!motorizado) {
      return res.status(404).json({ message: 'Motorizado no encontrado' });
    }
    res.json(motorizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener motorizado', error: error.message });
  }
});

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { nombre, placa, celular } = req.body;

    const nuevoMotorizado = await Motorizado.create({
      nombre,
      placa,
      celular
    });

    res.status(201).json(nuevoMotorizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear motorizado', error: error.message });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const motorizadoActualizado = await Motorizado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!motorizadoActualizado) {
      return res.status(404).json({ message: 'Motorizado no encontrado' });
    }

    res.json(motorizadoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar motorizado', error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const motorizadoEliminado = await Motorizado.findByIdAndDelete(req.params.id);

    if (!motorizadoEliminado) {
      return res.status(404).json({ message: 'Motorizado no encontrado' });
    }

    res.json({ message: 'Motorizado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar motorizado', error: error.message });
  }
});

export default router;
