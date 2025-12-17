# Guía de Instalación - Sistema de Gestión de Pedidos y Delivery

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en MongoDB Atlas

## Paso 1: Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea una cuenta gratuita o inicia sesión
3. Crea un nuevo cluster:
   - Click en "Build a Database"
   - Selecciona "FREE" (M0)
   - Elige una región cercana
   - Click en "Create"

4. Configura el acceso:
   - En "Security" → "Database Access", crea un usuario con permisos de lectura/escritura
   - En "Security" → "Network Access", agrega tu IP o `0.0.0.0/0` (solo para desarrollo)

5. Obtén la cadena de conexión:
   - Click en "Connect" en tu cluster
   - Selecciona "Connect your application"
   - Copia la cadena de conexión (URI)
   - Reemplaza `<password>` con tu contraseña
   - Reemplaza `myFirstDatabase` con `delivery-system`

## Paso 2: Configurar el Backend

### 2.1 Instalar Dependencias

```bash
cd server
npm install
```

### 2.2 Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `server/` con el siguiente contenido:

```env
MONGO_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/delivery-system?retryWrites=true&w=majority
JWT_SECRET=mi_clave_secreta_super_segura_123456
PORT=5000
```

**Importante:** Reemplaza los valores:
- `tu_usuario`: Tu usuario de MongoDB Atlas
- `tu_password`: Tu contraseña de MongoDB Atlas
- `cluster0.xxxxx.mongodb.net`: Tu URL de cluster real
- `JWT_SECRET`: Cambia por una clave secreta única y segura

### 2.3 Iniciar el Servidor Backend

```bash
npm start
```

O para desarrollo con auto-reinicio:

```bash
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
✅ Usuario administrador inicial creado:
   Username: admin
   Password: 123456789
🚀 Servidor corriendo en http://localhost:5000
```

## Paso 3: Configurar el Frontend

### 3.1 Volver a la Carpeta Raíz

```bash
cd ..
```

### 3.2 Instalar Dependencias

```bash
npm install
```

### 3.3 Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## Paso 4: Probar la Aplicación

### 4.1 Iniciar Sesión como Administrador

1. Abre `http://localhost:5173` en tu navegador
2. Usa las credenciales del administrador:
   - **Username:** `admin`
   - **Password:** `123456789`

### 4.2 Crear Datos de Prueba

Como administrador, crea:

1. **Clientes** (empresas de negocio):
   - Nombre: "Distribuidora Central"
   - Dueño: "Juan Pérez"
   - DNI/RUC: "20123456789"
   - Celular: "987654321"
   - Dirección: "Av. Principal 123"

2. **Motorizados** (conductores):
   - Nombre: "Carlos Ramírez"
   - Placa: "ABC-123"
   - Celular: "912345678"

3. **Pedidos**:
   - Selecciona un cliente
   - Asigna un motorizado (opcional)
   - Completa los datos del cliente final
   - Establece el precio
   - Cambia el estado según corresponda

### 4.3 Probar Registro de Cliente

1. Cierra sesión del admin
2. Click en "¿No tienes cuenta? Regístrate"
3. Registra un nuevo usuario:
   - Username: "cliente1"
   - Password: "123456"
4. Inicia sesión con el nuevo usuario
5. Verás la interfaz del cliente con la opción de crear pedidos

## Estructura de Carpetas Final

```
project/
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env                 ← Crear este archivo
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── src/
│   ├── components/
│   ├── contexts/
│   └── services/
├── package.json
└── README.md
```

## Comandos Útiles

### Backend (carpeta server/)
```bash
npm start          # Iniciar servidor de producción
npm run dev        # Iniciar servidor de desarrollo con nodemon
```

### Frontend (carpeta raíz)
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Vista previa de build de producción
```

## Solución de Problemas

### Error: "MongoServerError: bad auth"
- Verifica que tu usuario y contraseña sean correctos en el `.env`
- Asegúrate de que el usuario tenga permisos de lectura/escritura

### Error: "CORS policy"
- Verifica que el backend esté corriendo en `http://localhost:5000`
- El frontend debe estar en `http://localhost:5173`

### Error: "Cannot find module"
- Ejecuta `npm install` en ambas carpetas (raíz y server/)

### El usuario admin no se crea
- Elimina la base de datos en MongoDB Atlas y reinicia el servidor
- El usuario solo se crea si la colección está vacía

## Credenciales por Defecto

### Usuario Administrador Inicial
- **Username:** admin
- **Password:** 123456789
- **Rol:** Admin

**Importante:** Cambia la contraseña del administrador después del primer inicio de sesión.

## Siguiente Pasos

1. Crear más usuarios de prueba
2. Configurar datos reales de clientes y motorizados
3. Probar el flujo completo de pedidos
4. Personalizar los colores y estilos según tu marca
5. Preparar para despliegue en producción

## Soporte

Para más información, consulta el archivo `README.md`.
