import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { useRegisterContext } from "../context/RegisterContext";
import { useMatchContext } from "../context/MatchContext";
import Config from '../utils/config';

const MatchScreen = ({ navigation }) => {
  const { registerData } = useRegisterContext();
  const { addMatch } = useMatchContext();

  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position] = useState(new Animated.ValueXY());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Perfil actual
  const currentProfile = users[currentIndex];

  // Al montar/actualizar, si tenemos userId, cargamos usuarios
  useEffect(() => {
    if (registerData?._id) {
      fetchUsers();
    } else {
      setLoading(false);
      setError("No se pudo identificar al usuario");
    }
  }, [registerData?._id]);

  // Petición al backend para obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${Config.API.BASE_URL}${Config.API.ENDPOINTS.RANDOM_USERS}?userId=${registerData._id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un array");
      }
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejo genérico de swipe (like/dislike)
  const handleSwipe = async (direction) => {
    if (!currentProfile || !registerData?._id) return;
    const user = currentProfile;
    const status = direction === "right" ? "accepted" : "rejected";

    try {
      const response = await fetch(
        `${Config.API.BASE_URL}${Config.API.ENDPOINTS.MATCH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1: registerData._id,
          user2: user._id,
          status,
        }),
      });
      const result = await response.json();

      // Si hay match mutuo, lo agregamos al contexto
      if (result.match) {
        addMatch(user);
        Alert.alert("¡Es un match!", `¡Has hecho match con ${user.name}!`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al registrar match");
    }

    // Pasamos al siguiente usuario
    setCurrentIndex((prevIndex) => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  // Dislike (swipe a la izquierda)
  const handleDislike = () => {
    Animated.spring(position, {
      toValue: { x: -500, y: 0 },
      useNativeDriver: true,
    }).start(() => handleSwipe("left"));
  };

  // Like (swipe a la derecha)
  const handleLike = () => {
    Animated.spring(position, {
      toValue: { x: 500, y: 0 },
      useNativeDriver: true,
    }).start(() => handleSwipe("right"));
  };

  // PanResponder para drag & drop
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          handleLike();
        } else if (gesture.dx < -120) {
          handleDislike();
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Render mientras cargan los datos
  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <CustomNavBar />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E82561" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  // Render en caso de error
  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <CustomNavBar />
          <View style={styles.loadingContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  // Render si ya no hay más perfiles
  if (currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <CustomNavBar />
          <View style={styles.noProfilesContainer}>
            <Text style={styles.noProfilesText}>No hay más perfiles disponibles</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
              <Text style={styles.retryButtonText}>Recargar</Text>
            </TouchableOpacity>
          </View>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  // Render principal con la tarjeta del perfil actual
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <CustomNavBar />

        {/* Tarjeta animada con PanResponder */}
        <Animated.View
          style={[
            styles.profileCard,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                {
                  rotate: position.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ["-30deg", "0deg", "30deg"],
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Foto de perfil o placeholder */}
          <Image
            source={{
              uri:
                currentProfile.photos?.[0] || "https://via.placeholder.com/400",
            }}
            style={styles.profileImage}
            resizeMode="cover"
          />

          {/* Información de perfil */}
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>
              {currentProfile.name}, {currentProfile.age}
            </Text>
            <Text style={styles.descriptionText}>
              {currentProfile.description || "Sin descripción"}
            </Text>
          </View>
        </Animated.View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.dislikeButton} onPress={handleDislike}>
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Text style={styles.buttonText}>❤️</Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

// Estilos (tomados del snippet de diseño original, adaptados mínimamente)
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFE4CF", // Fondo durazno
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#E82561",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#E82561",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noProfilesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProfilesText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },

  // Tarjeta de perfil
  profileCard: {
    width: "90%",
    height: "67%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  profileImage: {
    width: "100%",
    height: "80%", // 80% de la tarjeta para la imagen
  },
  profileInfo: {
    padding: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E82561",
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },

  // Botones (dislike/like)
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  dislikeButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  likeButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default MatchScreen;
