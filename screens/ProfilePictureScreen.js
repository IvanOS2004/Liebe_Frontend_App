import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import CustomNavBar from "../components/CustomNavBar";

const ProfilePictureScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomNavBar />
      <Text style={styles.title}>Sube tu foto de perfil</Text>

      {/* Contenedor de la imagen (Placeholder) */}
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>Imagen Aquí</Text>
      </View>

      {/* Botón para seleccionar imagen */}
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {/* Botón de continuar */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#FFE4CF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E82561", // Fondo placeholder
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    color: "#fff",
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#E82561",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfilePictureScreen;
