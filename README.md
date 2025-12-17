# Sistema de Gestión de Pedidos y Delivery

Sistema Full Stack MERN para la gestión de pedidos y servicios de delivery.

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- MongoDB Atlas con Mongoose
- JWT para autenticación
- bcryptjs para encriptación de contraseñas

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Lucide React (iconos)

## Estructura del Proyecto

```
project/
├── server/                    # Backend Node.js/Express
│   ├── config/
│   │   └── database.js       # Configuración de MongoDB y usuario admin inicial
│   ├── middleware/
│   │   └── auth.js           # Middlewares de autenticación y autorización
│   ├── models/               # Modelos de Mongoose
│   │   ├── Usuario.js
│   │   ├── Cliente.js
│   │   ├── Motorizado.js
│   │   └── Pedido.js
│   ├── routes/               # Rutas de la API
│   │   ├── auth.js
│   │   ├── clientes.js
│   │   ├── motorizados.js
│   │   └── pedidos.js
│   ├── .env.example          # Plantilla de variables de entorno
│   ├── package.json
│   └── server.js             # Punto de entrada del servidor
│
└── src/                      # Frontend React
    ├── components/
    │   ├── admin/
    │   │   ├── AdminDashboard.tsx
    │   │   ├── ClientesManagement.tsx
    │   │   ├── MotorizadosManagement.tsx
    │   │   └── PedidosManagement.tsx
    │   ├── cliente/
    │   │   └── ClienteDashboard.tsx
    │   └── Login.tsx
    ├── contexts/
    │   └── AuthContext.tsx   # Contexto de autenticación
    ├── services/
    │   └── api.ts            # Servicios de API
    └── App.tsx
```

## Configuración e Instalación

### 1. Configurar MongoDB Atlas

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster
3. Configura el acceso de red (permite tu IP o 0.0.0.0/0 para desarrollo)
4. Crea un usuario de base de datos
5. Obtén la cadena de conexión (URI)

### 2. Backend

```bash
cd server
npm install
```

Crea un archivo `.env` en la carpeta `server/`:

```env
MONGO_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/delivery-system?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
PORT=5000
```

Inicia el servidor:

```bash
npm start
# o para desarrollo con nodemon:
npm run dev
```

### 3. Frontend

```bash
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Usuario Administrador Inicial

El sistema crea automáticamente un usuario administrador al iniciar por primera vez:

- **Username:** `admin`
- **Password:** `123456789`
- **Rol:** Admin

## Funcionalidades

### Roles y Permisos

#### Administrador (Admin)
- Acceso total al sistema
- CRUD completo de:
  - Clientes (empresas de negocio)
  - Motorizados (conductores)
  - Pedidos (gestión completa)
- Asignación de motorizados a pedidos
- Cambio de estados de pedidos

#### Cliente
- Crear nuevos pedidos
- Ver sus propios pedidos
- Marcar pedidos como "recibidos" cuando están en estado "entregado"

### Estados de Pedidos

- **pendiente:** Pedido creado, sin motorizado asignado
- **asignado:** Motorizado asignado al pedido
- **entregado:** Pedido entregado por el motorizado
- **recibido:** Cliente confirma recepción del pedido
- **cancelado:** Pedido cancelado

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de clientes
- `POST /api/auth/login` - Inicio de sesión

### Clientes (Solo Admin)
- `GET /api/clientes` - Listar todos los clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Motorizados (Solo Admin)
- `GET /api/motorizados` - Listar todos los motorizados
- `POST /api/motorizados` - Crear motorizado
- `PUT /api/motorizados/:id` - Actualizar motorizado
- `DELETE /api/motorizados/:id` - Eliminar motorizado

### Pedidos
- `GET /api/pedidos` - Listar pedidos (Admin: todos / Cliente: propios)
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/:id` - Actualizar pedido (Admin: completo / Cliente: solo estado a "recibido")
- `DELETE /api/pedidos/:id` - Eliminar pedido (Solo Admin)

## Características de Diseño

- Interfaz moderna y responsive
- Color principal: Verde
- Diseño limpio y profesional
- Animaciones suaves
- Feedback visual claro para el usuario
- Optimizado para dispositivos móviles y desktop

## Seguridad

- Contraseñas encriptadas con bcryptjs
- Autenticación JWT
- Middleware de autorización por roles
- CORS configurado para desarrollo
- Validación de datos en backend

## Desarrollo

El proyecto está configurado para desarrollo local con:
- Hot reload en frontend (Vite)
- Nodemon para reinicio automático del backend
- TypeScript para type safety en frontend
- ESLint para calidad de código

## Producción

Para preparar el proyecto para producción:

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.
