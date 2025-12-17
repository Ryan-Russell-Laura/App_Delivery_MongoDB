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

connectDB();

// INICIO DEL CAMBIO CRÍTICO DE CORS
// 1. Define los orígenes permitidos
const allowedOrigins = [
    'http://localhost:5173', // Para desarrollo local
    'https://appdeliverymongodb.netlify.app' // <<-- ¡PEGA AQUÍ TU URL DE NETLIFY!
];

// 2. Aplica la configuración de CORS
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // Esto es CRUCIAL si manejas tokens de autorización
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
