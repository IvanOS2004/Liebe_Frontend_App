import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";

const MatchScreen = ({ navigation }) => {
  // Datos de ejemplo para el perfil
  const [profile, setProfile] = useState({
    name: "Ana López",
    age: 25,
    description:
      "Amante de los animales y la naturaleza. Siempre lista para una aventura.",
    photo: "https://via.placeholder.com/400",
  });

  // Estado para la animación de deslizamiento
  const [position] = useState(new Animated.ValueXY());

  // Función para manejar el like
  const handleLike = () => {
    Animated.spring(position, {
      toValue: { x: 500, y: 0 }, // Mueve la tarjeta hacia la derecha
      useNativeDriver: true,
    }).start(() => {
      // Reinicia la posición y carga un nuevo perfil
      position.setValue({ x: 0, y: 0 });
      setProfile({
        name: "Carlos Ruiz",
        age: 30,
        description:
          "Fanático del fútbol y la tecnología. Busco alguien con quien compartir buenos momentos.",
        photo: "https://via.placeholder.com/400",
      });
    });
  };

  // Función para manejar el dislike
  const handleDislike = () => {
    Animated.spring(position, {
      toValue: { x: -500, y: 0 }, // Mueve la tarjeta hacia la izquierda
      useNativeDriver: true,
    }).start(() => {
      // Reinicia la posición y carga un nuevo perfil
      position.setValue({ x: 0, y: 0 });
      setProfile({
        name: "Laura Martínez",
        age: 28,
        description:
          "Amante del arte y la música. Siempre buscando nuevas experiencias.",
        photo: "https://via.placeholder.com/400",
      });
    });
  };

  // Configuración del PanResponder para detectar gestos de deslizamiento
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        handleLike(); // Deslizamiento hacia la derecha (like)
      } else if (gesture.dx < -120) {
        handleDislike(); // Deslizamiento hacia la izquierda (dislike)
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 }, // Vuelve a la posición inicial
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <CustomNavBar />
        {/* Tarjeta de perfil */}
        <Animated.View
          style={[
            styles.profileCard,
            {
              transform: [
                { translateX: position.x }, // Movimiento horizontal
                { translateY: position.y }, // Movimiento vertical
                {
                  rotate: position.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ["-30deg", "0deg", "30deg"], // Rotación al deslizar
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: profile.photo }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>
              {profile.name}, {profile.age}
            </Text>
            <Text style={styles.descriptionText}>{profile.description}</Text>
          </View>
        </Animated.View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.dislikeButton}
            onPress={handleDislike}
          >
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

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFE4CF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    height: "80%",
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
