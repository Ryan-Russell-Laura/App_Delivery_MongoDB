import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  dueño: {
    type: String,
    required: true,
    trim: true
  },
  dni_ruc: {
    type: String,
    required: true,
    trim: true
  },
  celular: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Cliente', clienteSchema);
