import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado exitosamente');

    await createInitialAdmin();
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const createInitialAdmin = async () => {
  try {
    const usuariosCount = await Usuario.countDocuments();

    if (usuariosCount === 0) {
      const hashedPassword = await bcrypt.hash('123456789', 10);

      await Usuario.create({
        username: 'admin',
        password: hashedPassword,
        rol: 'Admin'
      });

      console.log('✅ Usuario administrador inicial creado:');
      console.log('   Username: admin');
      console.log('   Password: 123456789');
    }
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error.message);
  }
};

export default connectDB;
