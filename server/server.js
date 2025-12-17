import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import motorizadosRoutes from './routes/motorizados.js';
import pedidosRoutes from './routes/pedidos.js';

dotenv.config();

/*const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
*/
const app = express();
const PORT = process.env.PORT || 5000;

// MODIFICACIÓN AQUÍ: Permitir origen dinámico
const allowedOrigins = [
  'http://localhost:5173', // Para desarrollo local
  'https://appdeliverymongodb.netlify.app' // Para producción (lo configuraremos en Render)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman) o si el origen está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/motorizados', motorizadosRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API del Sistema de Gestión de Pedidos y Delivery' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
