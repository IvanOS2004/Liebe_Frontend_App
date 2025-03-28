import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { useRegisterContext } from "../context/RegisterContext";
// Importa el contexto donde tienes la función removeMatch
import { useMatchContext } from "../context/MatchContext";


const { height } = Dimensions.get("window");

// Ajusta estos valores si deseas modificar tamaños/márgenes
const NAVBAR_HEIGHT = 60;
const BOTTOM_NAV_HEIGHT = 60;
const MARGIN = 40;

const MatchesScreen = ({ navigation }) => {
  const { registerData } = useRegisterContext();
  // Obtenemos la función removeMatch desde el contexto
  const { removeMatch } = useMatchContext();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calcula la altura disponible para el ScrollView (área central)
  const scrollViewHeight =
    height - NAVBAR_HEIGHT - BOTTOM_NAV_HEIGHT - 2 * MARGIN;

  useEffect(() => {
    if (registerData?._id) {
      fetchMatches();
    } else {
      setLoading(false);
      setError("No se pudo identificar al usuario");
    }
  }, [registerData?._id]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.1.70:3000/matches?userId=${registerData._id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un array");
      }
      setMatches(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Error al cargar matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar match (localmente y desde el contexto)
  const handleRemoveMatch = (matchId) => {
    // Llamamos a la función del contexto
    removeMatch(matchId);
    // Opcional: eliminamos también del estado local para refrescar la lista en pantalla
    setMatches((prev) => prev.filter((m) => m._id !== matchId));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        {/* Barra superior fija */}
        <View style={styles.topNavContainer}>
          <CustomNavBar />
        </View>

        {/* Contenido centrado al cargar */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E82561" />
          <Text style={{ marginTop: 10, color: "#666" }}>Cargando...</Text>
        </View>

        {/* Barra inferior fija */}
        <View style={styles.bottomNavContainer}>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        {/* Barra superior fija */}
        <View style={styles.topNavContainer}>
          <CustomNavBar />
        </View>

        {/* Contenido centrado en caso de error */}
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMatches}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>

        {/* Barra inferior fija */}
        <View style={styles.bottomNavContainer}>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Barra superior fija */}
      <View style={styles.topNavContainer}>
        <CustomNavBar />
      </View>

      {/* Contenedor con scroll, ajustado en altura */}
      <View
        style={[
          styles.chatContainer,
          {
            height: scrollViewHeight,
            marginTop: NAVBAR_HEIGHT + MARGIN,
            marginBottom: BOTTOM_NAV_HEIGHT + MARGIN,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {matches.length > 0 ? (
            matches.map((match) => {
              // Verificamos que existan user1 y user2
              if (!match.user1 || !match.user2) return null;
              // Determinamos el "otro" usuario
              const otherUser =
                match.user1._id === registerData._id ? match.user2 : match.user1;
              // Se usa la primera foto o un placeholder
              const photo = otherUser.photos?.[0] || "https://via.placeholder.com/50";

              return (
                <View key={match._id} style={styles.profileItem}>
                  {/* Avatar */}
                  <Image source={{ uri: photo }} style={styles.profileAvatar} />

                  {/* Nombre y edad */}
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {otherUser.name}, {otherUser.age}
                    </Text>
                  </View>

                  {/* Botones (X y Corazón) */}
                  <View style={styles.profileActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleRemoveMatch(match._id)}
                    >
                      <Ionicons name="close" size={24} color="#FF5864" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="heart" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noMatchesText}>No tienes matches aún.</Text>
          )}
        </ScrollView>
      </View>

      {/* Barra inferior fija */}
      <View style={styles.bottomNavContainer}>
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
  topNavContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 10,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    width: "100%",
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E82561",
  },
  profileActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
  noMatchesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  // Error
  errorText: {
    fontSize: 16,
    color: "#E82561",
    marginBottom: 10,
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
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default MatchesScreen;
