import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";

const { height } = Dimensions.get("window"); // Obtiene la altura de la pantalla

const chats = [
  {
    id: "1",
    name: "Ana López",
    message: "Hola, ¿cómo estás?",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Carlos Pérez",
    message: "¿Nos vemos mañana?",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "Sofía Gómez",
    message: "¡Te mando la info ahora!",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "4",
    name: "Juan Torres",
    message: "Listo para el proyecto",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "5",
    name: "María Sánchez",
    message: "Nos vemos en la oficina",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: "6",
    name: "Luis Herrera",
    message: "Ya revisé el documento",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "7",
    name: "Pedro Ramírez",
    message: "Confirmo la cita",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "8",
    name: "Elena Flores",
    message: "Buen día!",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "9",
    name: "Fernando Ríos",
    message: "Estoy en camino",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: "10",
    name: "Natalia Vega",
    message: "Nos vemos pronto",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
  },
];

const NAVBAR_HEIGHT = 60; // Altura de CustomNavBar
const BOTTOM_NAV_HEIGHT = 60; // Altura de BottomNavBar
const MARGIN = 40; // Margen de 40 tanto arriba como abajo

const ChatScreen = ({ navigation }) => {
  // Calculamos la altura disponible para el ScrollView
  const scrollViewHeight =
    height - NAVBAR_HEIGHT - BOTTOM_NAV_HEIGHT - 2 * MARGIN;

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Navbar superior fija */}
      <View style={styles.topNavContainer}>
        <CustomNavBar />
      </View>

      {/* Contenedor de chats con scroll */}
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
          {chats.map((item) => (
            <TouchableOpacity key={item.id} style={styles.chatItem}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.chatInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.message}>{item.message}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Navbar inferior fija */}
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
  chatContainer: {
    width: "100%", // Ocupa todo el ancho
    overflow: "hidden", // Corta el contenido que se desborda
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20, // Espaciado extra para evitar que el último mensaje se oculte
  },
  chatItem: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
});

export default ChatScreen;
