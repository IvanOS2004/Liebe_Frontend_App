import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { useRegisterContext } from "../context/RegisterContext";
import { useMatchContext } from "../context/MatchContext";

const { height } = Dimensions.get("window");
const NAVBAR_HEIGHT = 60;
const BOTTOM_NAV_HEIGHT = 60;
const MARGIN = 40;

const MatchesScreen = ({ navigation }) => {
  const { registerData } = useRegisterContext();
  const { removeMatch } = useMatchContext();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el modal de confirmación
  const [modalVisible, setModalVisible] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);

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

  // Función para abrir el modal y guardar el match a eliminar
  const handleRemoveMatch = (matchId) => {
    console.log("handleRemoveMatch llamado con matchId:", matchId);
    setMatchToDelete(matchId);
    setModalVisible(true);
  };

  const confirmRemoveMatch = async () => {
    if (!matchToDelete) return;
    try {
      console.log("Intentando eliminar match con ID:", matchToDelete);
      const response = await fetch(
        `http://192.168.1.70:3000/matches/${matchToDelete}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        console.log("Match eliminado correctamente:", matchToDelete);
        setMatches((prev) => prev.filter((m) => m._id !== matchToDelete));
      } else {
        const data = await response.json();
        console.error("Error del servidor al eliminar match:", data);
      }
    } catch (error) {
      console.error("Error al intentar eliminar el match:", error);
    } finally {
      setModalVisible(false);
      setMatchToDelete(null);
    }
  };

  // Función para iniciar la conversación al pulsar el icono de "heart"
  const startChat = async (match) => {
    // Determina el otro usuario
    const otherUser =
      match.user1._id === registerData._id ? match.user2 : match.user1;
    try {
      // Llama al endpoint para crear o recuperar la conversación
      const response = await fetch("http://192.168.1.70:3000/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1: registerData._id,
          user2: otherUser._id,
        }),
      });
      const conversation = await response.json();
      // Navega a la pantalla de chat
      navigation.navigate("ChatRoom", {
        conversationId: conversation._id,
        chatName: otherUser.name,
        chatAvatar: otherUser.photos?.[0] || "https://via.placeholder.com/50",
        userId: registerData._id,
        otherUserId: otherUser._id,
      });
    } catch (err) {
      console.error("Error iniciando la conversación:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.topNavContainer}>
          <CustomNavBar />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E82561" />
          <Text style={{ marginTop: 10, color: "#666" }}>Cargando...</Text>
        </View>
        <View style={styles.bottomNavContainer}>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.topNavContainer}>
          <CustomNavBar />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMatches}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomNavContainer}>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topNavContainer}>
        <CustomNavBar />
      </View>
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
              if (!match.user1 || !match.user2) return null;
              const otherUser =
                match.user1._id === registerData._id ? match.user2 : match.user1;
              const photo =
                otherUser.photos?.[0] || "https://via.placeholder.com/50";
              return (
                <View key={match._id} style={styles.profileItem}>
                  <Image source={{ uri: photo }} style={styles.profileAvatar} />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {otherUser.name}, {otherUser.age}
                    </Text>
                  </View>
                  <View style={styles.profileActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleRemoveMatch(match._id)}
                    >
                      <Ionicons name="close" size={24} color="#FF5864" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => startChat(match)}
                    >
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
      <View style={styles.bottomNavContainer}>
        <BottomNavBar navigation={navigation} />
      </View>

      {/* Modal de confirmación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setMatchToDelete(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas eliminar este match?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  console.log("Eliminación cancelada");
                  setModalVisible(false);
                  setMatchToDelete(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmRemoveMatch}
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    height: NAVBAR_HEIGHT,
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
    height: BOTTOM_NAV_HEIGHT,
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
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#E82561",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#aaa",
  },
  deleteButton: {
    backgroundColor: "#E82561",
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default MatchesScreen;
