// RegisterContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para carga inicial

  // Función para persistir datos con manejo de errores
  const persistData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      setRegisterData(data);
    } catch (error) {
      console.error("Error al guardar datos en AsyncStorage:", error);
      throw error; // Puedes manejar este error donde llames a persistData
    }
  };

  // Función para actualizar datos y persistirlos
  const updateRegisterData = async (newData) => {
    const updatedData = { ...registerData, ...newData };
    try {
      await persistData(updatedData);
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      throw error;
    }
  };

  // Cargar datos al iniciar con manejo de errores
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setRegisterData(parsedData);
        }
      } catch (error) {
        console.error("Error al cargar datos desde AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <RegisterContext.Provider 
      value={{ 
        registerData, 
        setRegisterData: persistData, // Sobreescribimos setRegisterData con persistData
        updateRegisterData,
        isLoading // Exportamos el estado de carga
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegisterContext = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error('useRegisterContext debe usarse dentro de un RegisterProvider');
  }
  return context;
};