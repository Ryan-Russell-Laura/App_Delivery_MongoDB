import express from 'express';
import Pedido from '../models/Pedido.js';
import { authenticate, isAdmin, isCliente } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let pedidos;

    if (req.user.rol === 'Admin') {
      pedidos = await Pedido.find()
        .populate('clienteId', 'nombre')
        .populate('motorizadoId', 'nombre placa')
        .sort({ createdAt: -1 });
    } else {
      pedidos = await Pedido.find({ clienteId: req.user.id })
        .populate('clienteId', 'nombre')
        .populate('motorizadoId', 'nombre placa')
        .sort({ createdAt: -1 });
    }

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('clienteId', 'nombre')
      .populate('motorizadoId', 'nombre placa');

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (req.user.rol === 'Cliente' && pedido.clienteId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a este pedido' });
    }

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedido', error: error.message });
  }
});

// En server/routes/pedidos.js
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    // 1. Incluir 'motorizadoId' en la desestructuración
    const { clienteId, motorizadoId, descripcion, clienteFinal, celularCliente, direccionEntrega, precio } = req.body;

    // 2. Usar Pedido.create con todos los campos
    // Usar motorizadoId puede ser null/undefined si no se envía, lo cual está bien por tu Schema.
    const nuevoPedido = await Pedido.create({
      clienteId,
      motorizadoId, // <--- Agregar este campo aquí
      descripcion,
      clienteFinal,
      celularCliente,
      direccionEntrega,
      precio
    });

    // 3. Buscar y poblar el pedido recién creado (ESTO ES PERFECTO Y DEBE QUEDAR IGUAL)
    const pedidoCompleto = await Pedido.findById(nuevoPedido._id)
      .populate('clienteId', 'nombre')
      .populate('motorizadoId', 'nombre placa');

    res.status(201).json(pedidoCompleto);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (req.user.rol === 'Cliente') {
      if (pedido.clienteId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'No tienes acceso a este pedido' });
      }

      if (req.body.estado && req.body.estado !== 'recibido') {
        return res.status(403).json({ message: 'Solo puedes actualizar el estado a "recibido"' });
      }

      if (req.body.estado === 'recibido') {
        pedido.estado = 'recibido';
        await pedido.save();

        const pedidoActualizado = await Pedido.findById(pedido._id)
          .populate('clienteId', 'nombre')
          .populate('motorizadoId', 'nombre placa');

        return res.json(pedidoActualizado);
      }

      return res.status(403).json({ message: 'Operación no permitida' });
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('clienteId', 'nombre')
      .populate('motorizadoId', 'nombre placa');

    res.json(pedidoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);

    if (!pedidoEliminado) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json({ message: 'Pedido eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar pedido', error: error.message });
  }
});

export default router;
