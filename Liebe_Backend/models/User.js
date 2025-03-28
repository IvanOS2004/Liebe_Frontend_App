// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {                      // [AÑADIDO]
    type: String,
    default: "",
  },
  gender: {
    type: String, // "XY (Masculino biologico)", "XX (Femenino biologico)", "Otro"
    default: null,
  },
  interests: {
    type: [String], // Lista de intereses
    default: [],
  },
  photos: {
    type: [String], // Lista de URLs o base64 strings
    default: [],
  },
  age: {
    type: Number,
    default: null,
  },
  description: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "Ciudad Ejemplo",
  },
  crop: {
    translationX: { type: Number, default: 0 },
    translationY: { type: Number, default: 0 },
    scale: { type: Number, default: 1 },
  },
});

module.exports = mongoose.model('User', UserSchema);