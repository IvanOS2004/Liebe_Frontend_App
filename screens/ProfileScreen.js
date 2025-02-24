import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";

const ProfileScreen = ({ navigation }) => {
  // Datos de ejemplo
  const gustos = [
    "Música",
    "Cine",
    "Deportes",
    "Videojuegos",
    "Viajar",
    "Arte",
  ];
  const descripcion =
    "Apasionado por la tecnología y los videojuegos. Me encanta viajar y conocer nuevas culturas. Siempre en busca de nuevas experiencias.";

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tu Perfil</Text>

        {/* Foto de perfil */}
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }} // Puedes reemplazar con la foto del usuario
          style={styles.profileImage}
        />

        {/* Información del usuario */}
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>Nombre del Usuario</Text>
          <Text style={styles.profileInfo}>Edad: 25</Text>
          <Text style={styles.profileInfo}>Ubicación: Ciudad Ejemplo</Text>
        </View>

        {/* Descripción del usuario */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Sobre mí</Text>
          <Text style={styles.descriptionText}>{descripcion}</Text>
        </View>

        {/* Gustos del usuario en tarjetas */}
        <Text style={styles.sectionTitle}>Tus Gustos</Text>
        <View style={styles.gustosContainer}>
          {gustos.map((gusto, index) => (
            <View key={index} style={styles.gustoCard}>
              <Text style={styles.gustoText}>{gusto}</Text>
            </View>
          ))}
        </View>

        {/* Botón para editar el perfil */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    backgroundColor: "#FFE4CF",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#E82561",
  },
  profileCard: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profileInfo: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  descriptionContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#555",
  },
  gustosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },
  gustoCard: {
    backgroundColor: "#E82561",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  gustoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#E82561",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
