import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";

const ProfileScreen = ({ navigation }) => {
  // Datos de ejemplo
  const profileData = {
    name: "Juan Pérez",
    age: 28,
    gender: "Hombre",
    description:
      "Amante de los viajes, la música y el deporte. Siempre buscando nuevas aventuras y experiencias.",
    interests: ["Viajes", "Música", "Deportes", "Cine", "Tecnología"],
    photos: [
      "https://via.placeholder.com/400", // URL de imagen de ejemplo
    ],
  };

  const { name, age, gender, description, interests, photos } = profileData;

  // Estado para controlar si se muestra el botón de editar
  const [isEditingImage, setIsEditingImage] = useState(false);

  // Función para manejar el clic en la imagen
  const handleImagePress = () => {
    setIsEditingImage(!isEditingImage);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <CustomNavBar />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Foto de perfil */}
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleImagePress}
            activeOpacity={0.8} // Opacidad al hacer clic
          >
            {photos?.length > 0 ? (
              <View>
                <Image
                  source={{ uri: photos[0] }}
                  style={[
                    styles.profileImage,
                    isEditingImage && styles.imageOpacity, // Aplicar opacidad si está en modo edición
                  ]}
                  resizeMode="cover"
                />
                {isEditingImage && (
                  <View style={styles.editButtonOverlay}>
                    <Text style={styles.editButtonText}>Editar Foto</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Información básica */}
          <View style={styles.basicInfoContainer}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.ageGenderText}>
              {age} años · {gender}
            </Text>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          {/* Gustos (etiquetas) */}
          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>

          {/* Botón de editar */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => navigation.navigate("EditProfile")} // Navegar a la pantalla de edición
          >
            <Text style={styles.saveButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Barra de navegación inferior */}
        <View style={styles.bottomNavBar}>
          <BottomNavBar navigation={navigation} />
        </View>
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
    backgroundColor: "#FFE4CF",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 100,
  },
  profileImageContainer: {
    width: "90%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginTop: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imageOpacity: {
    opacity: 0.5,
  },
  editButtonOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -12 }],
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E82561",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  placeholderText: {
    fontSize: 18,
    color: "#fff",
  },
  basicInfoContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "90%",
  },
  nameText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E82561",
    textAlign: "center",
  },
  ageGenderText: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  descriptionContainer: {
    width: "90%",
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    width: "90%",
  },
  interestChip: {
    backgroundColor: "#E82561",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  interestText: {
    color: "#fff",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#E82561",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomNavBar: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ProfileScreen;
