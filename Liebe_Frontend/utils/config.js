// Liebe_Frontend_App-master/utils/config.js
import { Platform } from 'react-native';

// Configuración principal
const Config = {
  // Configuración de la API
  API: {
    // Se usa siempre la URL de Railway
    BASE_URL: 'https://liebe-backend-main-production.up.railway.app',
    
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
  
  // Configuración de red (ajustada para que no interfiera en desarrollo)
  NETWORK: {
    USE_ADB_REVERSE: false,
    DEBUG: false
  }
};

export default Config;
