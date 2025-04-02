require("dotenv").config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importar modelo
const User = require("./models/User");
const Match = require("./models/Match");
const app = express();
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar con MongoDB:", err));

// ENDPOINT: Registro
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear nuevo usuario
    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// ENDPOINT: Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas (en producción usar bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Login exitoso -> DEVOLVEMOS TODOS LOS CAMPOS DEL USUARIO
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        _id: user._id, // Asegúrate de incluir este campo
        email: user.email,
        name: user.name,
        gender: user.gender,
        interests: user.interests,
        photos: user.photos,
        age: user.age,
        description: user.description,
        location: user.location,
        crop: user.crop,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

app.post('/check-match', async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    
    const existingMatch = await Match.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 }
      ]
    });

    res.status(200).json({ isMatch: existingMatch?.status === 'accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/matches/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const match = await Match.findByIdAndDelete(id);

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado." });
    }

    res.status(200).json({ message: "Match eliminado correctamente." });
  } catch (error) {
    console.error("Error eliminando match:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
});

// ENDPOINT: Actualizar perfil
app.put("/update-profile", async (req, res) => {
  try {
    const { email, name, gender, interests, photos, age, description, location, crop } = req.body;
    // Se espera que se envíe el email para identificar al usuario

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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
    return res.status(200).json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar perfil" });
  }
});

// ENDPOINT: Obtener usuarios aleatorios
app.get('/random-users', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    // Lógica para obtener usuarios aleatorios excluyendo al usuario actual
    const users = await User.aggregate([
      { $match: { 
        _id: { $ne: new mongoose.Types.ObjectId(userId) }, // Usa 'new' aquí
        // Puedes añadir más filtros aquí (género, intereses, etc.)
      }},
      { $sample: { size: 10 } } // Obtiene 10 usuarios aleatorios
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error en /random-users:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// ENDPOINT: Registrar un match
app.post("/match", async (req, res) => {
  try {
    const { user1, user2, status } = req.body;

    // Crear un nuevo match
    const newMatch = new Match({ user1, user2, status });
    await newMatch.save();

    // Verificar si el otro usuario también dio match
    if (status === "accepted") {
      const reciprocalMatch = await Match.findOne({
        user1: user2,
        user2: user1,
        status: "accepted",
      });

      if (reciprocalMatch) {
        return res.status(200).json({ message: "¡Es un match!", match: true });
      }
    }

    res.status(201).json({ message: "Match registrado", match: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar match" });
  }
});

// ENDPOINT: Obtener matches del usuario
app.get('/matches', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const matches = await Match.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'accepted'
    })
    .populate('user1 user2');

    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener matches" });
  }
});

// Obtener las conversaciones del usuario
app.get("/conversations", async (req, res) => {
  const { userId } = req.query;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "name photos"); // Ajusta los campos según necesites
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear (o recuperar) una conversación entre dos usuarios
app.post("/conversations", async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    // Verifica si ya existe una conversación entre ambos
    let conversation = await Conversation.findOne({
      participants: { $all: [user1, user2] },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [user1, user2],
      });
      await conversation.save();
    }
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener mensajes de una conversación específica (ordenados por fecha)
app.get("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversation: conversationId }).sort({ sentAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enviar un mensaje
app.post("/messages", async (req, res) => {
  const { conversationId, sender, receiver, message } = req.body;
  try {
    const newMessage = new Message({
      conversation: conversationId,
      sender,
      receiver,
      message,
      status: "sent",
    });
    await newMessage.save();
    // Actualizar la conversación con el último mensaje y la fecha de actualización
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      updatedAt: Date.now(),
    });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar el estado de un mensaje (por ejemplo, para marcarlo como leído)
app.put("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { status, receivedAt } = req.body;
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      {
        status,
        receivedAt: receivedAt || Date.now(),
      },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});