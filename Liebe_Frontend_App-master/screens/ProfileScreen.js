// ProfileScreen.js [MODIFICADO]
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { useRegisterContext } from "../context/RegisterContext";

const ProfileScreen = ({ navigation }) => {
  const { registerData, setRegisterData } = useRegisterContext();

  // Estados locales para editar nombre, edad y descripción
  const [name, setName] = useState(registerData.name || "");
  const [age, setAge] = useState(
    registerData.age ? registerData.age.toString() : ""
  );
  const [description, setDescription] = useState(registerData.description || "");

  // Si hay imagen en el contexto, se usa la primera (base64)
  const profileImageBase64 =
    registerData.photos && registerData.photos.length > 0
      ? registerData.photos[0]
      : null;
  // Transformación aplicada en el recorte
  const crop = registerData.crop || { translationX: 0, translationY: 0, scale: 1 };

  const handleSaveProfile = async () => {
    // Crear objeto con toda la información actualizada del perfil
    const updatedProfile = {
      ...registerData,
      name,                              
      age: parseInt(age),
      description,
    };

    // Actualizamos el contexto (opcional, para mantenerlo actualizado en el front)
    setRegisterData(updatedProfile);

    try {
      const response = await fetch("http://192.168.1.102:3000/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Perfil actualizado correctamente en la base de datos");
      } else {
        alert("Error al actualizar perfil: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al actualizar perfil");
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tu Perfil</Text>

        {/* Foto de perfil con recorte aplicado */}
        <View style={styles.profileImageContainer}>
          {profileImageBase64 ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${profileImageBase64}`,
              }}
              style={[
                styles.profileImage,
                {
                  transform: [
                    { translateX: crop.translationX },
                    { translateY: crop.translationY },
                    { scale: crop.scale },
                  ],
                },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* Información del usuario */}
        <View style={styles.profileCard}>
          {/* Campo para ingresar el nombre de usuario */}
          <TextInput
            style={styles.usernameInput}
            placeholder="Ingresa nombre de usuario"
            value={name}
            onChangeText={setName}
          />
          {/* Mostrar el email debajo del nombre */}
          <Text style={styles.emailText}>
            {registerData.email || "Correo electrónico"}
          </Text>

          <Text style={styles.profileInfo}>
            Edad: {age ? age : "No especificado"}
          </Text>
          <Text style={styles.profileInfo}>
            Ubicación: {registerData.location || "Ciudad Ejemplo"}
          </Text>
        </View>

        {/* Campos editables para Edad y Descripción */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Edad:</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="Ingresa tu edad"
          />
          <Text style={styles.inputLabel}>Descripción:</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Cuéntanos sobre ti"
          />
        </View>

        {/* Mostrar Género e Intereses */}
        <View style={styles.profileCard}>
          <Text style={styles.profileInfo}>
            Género: {registerData.gender || "No especificado"}
          </Text>
          <Text style={styles.profileInfo}>
            Intereses:{" "}
            {registerData.interests && registerData.interests.length > 0
              ? registerData.interests.join(", ")
              : "No especificados"}
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Guardar Perfil</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFE4CF" },
  scrollContainer: { alignItems: "center", paddingBottom: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 20 },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#E82561",
    marginBottom: 10,
  },
  profileImage: { width: "100%", height: "100%" },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  profileCard: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  usernameInput: {
    fontSize: 20,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  emailText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  profileInfo: { fontSize: 16, color: "#555", marginTop: 5 },
  inputContainer: { width: "90%", marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#E82561",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;