// Liebe_Frontend_App-master/utils/config.js
import { Platform } from 'react-native';

// Función para obtener la IP automáticamente en desarrollo
const getDevelopmentIP = () => {
  // 1. Para emuladores
  if (Platform.OS === 'android') return '10.0.2.2'; // Android Emulator
  if (Platform.OS === 'ios') return 'localhost'; // iOS Simulator
  
  // 2. Para dispositivos físicos (cambia esta lógica según tu red)
  const defaultIP = '192.168.1.70'; // IP de tu máquina en LAN
  
  // 3. Detección automática de IP (experimental - requiere permiso de red)
  try {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
  } catch (error) {
    console.log('Error obteniendo IP:', error);
  }
  
  return defaultIP;
};

// Configuración principal
const Config = {
  // Configuración de la API
  API: {
    BASE_URL: __DEV__
      ? `http://${getDevelopmentIP()}:3000`
      : 'https://tu-api-produccion.com', // Cambiar en producción
    
    ENDPOINTS: {
      MATCH: '/match', 
      RANDOM_USERS: '/random-users',
      LOGIN: '/login',
      REGISTER: '/register',
      MATCHES: '/matches',
      CONVERSATIONS: '/conversations',
      MESSAGES: '/messages',
      PROFILE: '/update-profile'
    },
    
    TIMEOUT: 15000, // 15 segundos
    HEADERS: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  },
  
  // Configuración de red
  NETWORK: {
    USE_ADB_REVERSE: true, // true para usar localhost en Android via adb reverse
    DEBUG: __DEV__
  }
};

// Sobreescribe configuración si usamos adb reverse
if (__DEV__ && Platform.OS === 'android' && Config.NETWORK.USE_ADB_REVERSE) {
  Config.API.BASE_URL = 'http://localhost:3000';
}

export default Config;