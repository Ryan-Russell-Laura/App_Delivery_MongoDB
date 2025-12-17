import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  motorizadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Motorizado',
    default: null
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  clienteFinal: {
    type: String,
    required: true,
    trim: true
  },
  celularCliente: {
    type: String,
    required: true,
    trim: true
  },
  direccionEntrega: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'asignado', 'entregado', 'recibido', 'cancelado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

export default mongoose.model('Pedido', pedidoSchema);
