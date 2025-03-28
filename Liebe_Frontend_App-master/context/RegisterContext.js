// RegisterContext.js
import React, { createContext, useState, useContext } from "react";

// Creamos el contexto
const RegisterContext = createContext();

// Provider para envolver la app
export const RegisterProvider = ({ children }) => {
  // registerData almacenará TODOS los datos del usuario logueado o registrado
  const [registerData, setRegisterData] = useState({});

  // Función para actualizar los datos del usuario
  const updateRegisterData = (data) => {
    setRegisterData((prevData) => ({
      ...prevData,
      ...data, // Combina los datos existentes con los nuevos
    }));
  };

  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData, updateRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
};

// Hook para consumir el contexto en cualquier pantalla
export const useRegisterContext = () => useContext(RegisterContext);