import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import motorizadosRoutes from './routes/motorizados.js';
import pedidosRoutes from './routes/pedidos.js';

dotenv.config();

const app = express();
// 1. Definimos el puerto correctamente (vital para Render)
const PORT = process.env.PORT || 5000;

// 2. Conectamos a la base de datos (UNA SOLA VEZ)
connectDB();

// 3. Configuración de CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://appdeliverymongodb.netlify.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// 4. Middlewares de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/motorizados', motorizadosRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API del Sistema de Gestión de Pedidos y Delivery' });
});

// 6. Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
