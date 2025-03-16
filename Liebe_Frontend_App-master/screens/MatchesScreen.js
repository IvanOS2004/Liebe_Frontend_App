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
import { Ionicons } from "@expo/vector-icons"; // Para los íconos de los botones

const { height } = Dimensions.get("window"); // Obtiene la altura de la pantalla

const matches = [
  {
    id: "1",
    name: "Ana López",
    age: 25,
    location: "Madrid, España",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Carlos Pérez",
    age: 28,
    location: "Barcelona, España",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "Sofía Gómez",
    age: 22,
    location: "Valencia, España",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "4",
    name: "Juan Torres",
    age: 30,
    location: "Sevilla, España",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "5",
    name: "María Sánchez",
    age: 27,
    location: "Zaragoza, España",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: "6",
    name: "Luis Herrera",
    age: 26,
    location: "Málaga, España",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "7",
    name: "Pedro Ramírez",
    age: 29,
    location: "Murcia, España",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "8",
    name: "Elena Flores",
    age: 24,
    location: "Palma, España",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "9",
    name: "Fernando Ríos",
    age: 31,
    location: "Bilbao, España",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: "10",
    name: "Natalia Vega",
    age: 23,
    location: "Alicante, España",
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

      {/* Contenedor de perfiles con scroll */}
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
          {matches.map((item) => (
            <View key={item.id} style={styles.profileItem}>
              <Image
                source={{ uri: item.avatar }}
                style={styles.profileAvatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {item.name}, {item.age}
                </Text>
                <Text style={styles.profileLocation}>{item.location}</Text>
              </View>
              <View style={styles.profileActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="close" size={24} color="#FF5864" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
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
    paddingBottom: 5, // Espaciado extra para evitar que el último mensaje se oculte
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
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileLocation: {
    fontSize: 14,
    color: "#666",
  },
  profileActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 10,
    padding: 10,
  },
});

export default ChatScreen;
