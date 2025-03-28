import React, { useState, useEffect, useContext } from "react";
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

const MatchScreen = ({ navigation }) => {
  const { registerData } = useRegisterContext();
  const { addMatch } = useMatchContext();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position] = useState(new Animated.ValueXY());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (registerData?._id) {
      fetchUsers();
    } else {
      setLoading(false);
      setError("No se pudo identificar al usuario");
    }
  }, [registerData?._id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.1.70:3000/random-users?userId=${registerData._id}`
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

  const handleSwipe = async (direction) => {
    if (!registerData?._id || currentIndex >= users.length) return;

    const user = users[currentIndex];
    const status = direction === "right" ? "accepted" : "rejected";

    try {
      const response = await fetch("http://192.168.1.70:3000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1: registerData._id,
          user2: user._id,
          status,
        }),
      });

      const result = await response.json();
      if (result.match) {
        addMatch(user);
        Alert.alert("¡Es un match!", `¡Has hecho match con ${user.name}!`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al registrar match");
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        Animated.spring(position, {
          toValue: { x: 500, y: 0 },
          useNativeDriver: true,
        }).start(() => handleSwipe("right"));
      } else if (gesture.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -500, y: 0 },
          useNativeDriver: true,
        }).start(() => handleSwipe("left"));
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <CustomNavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E82561" />
        </View>
        <BottomNavBar navigation={navigation} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <CustomNavBar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchUsers}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar navigation={navigation} />
      </SafeAreaView>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <CustomNavBar />
        <View style={styles.noUsersContainer}>
          <Text style={styles.noUsersText}>No hay más usuarios disponibles</Text>
        </View>
        <BottomNavBar navigation={navigation} />
      </SafeAreaView>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomNavBar />
      <View style={styles.container}>
        {currentUser && currentUser.photos && currentUser.photos.length > 0 ? (
          <Animated.View
            style={[
              styles.card,
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
            <Image
              source={{ uri: currentUser.photos[0] }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>
                {currentUser.name}, {currentUser.age}
              </Text>
              <Text style={styles.description}>{currentUser.description || "Sin descripción"}</Text>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.noPhotoContainer}>
            <Text style={styles.noPhotoText}>
              Este usuario no tiene fotos disponibles
            </Text>
          </View>
        )}
      </View>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#FFE4CF" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "90%",
    height: "70%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: { width: "100%", height: "80%" },
  info: { padding: 20 },
  name: { fontSize: 24, fontWeight: "bold", color: "#E82561" },
  description: { fontSize: 16, color: "#666", marginTop: 10 },
  noUsersContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noUsersText: { fontSize: 18, color: "#666" },
  noPhotoContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "70%",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
  },
  noPhotoText: { fontSize: 18, color: "#666", textAlign: "center" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    fontSize: 18,
    color: '#E82561',
    marginBottom: 20,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#E82561',
    padding: 15,
    borderRadius: 10
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
export default MatchScreen;