// server.js
require('dotenv').config();
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Para verificar
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar modelo
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

// ENDPOINT: Registro
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// ENDPOINT: Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseñas (aquí es directo, en producción usar bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Login exitoso
    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

//ENDPOINT PARA ACTUALIZAR PERFIL
app.put('/update-profile', async (req, res) => {
  try {
    const { email, name, gender, interests, photos, age, description, location, crop } = req.body;
    // Se espera que se envíe el email para identificar al usuario

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos si están presentes
    if (name !== undefined) user.name = name;
    if (gender !== undefined) user.gender = gender;
    if (interests !== undefined) user.interests = interests;
    if (photos !== undefined) user.photos = photos;
    if (age !== undefined) user.age = age;
    if (description !== undefined) user.description = description;
    if (location !== undefined) user.location = location;
    if (crop !== undefined) user.crop = crop;

    await user.save();
    return res.status(200).json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});