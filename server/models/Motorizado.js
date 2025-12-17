import mongoose from 'mongoose';

const motorizadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  placa: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  celular: {
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

export default mongoose.model('Motorizado', motorizadoSchema);
