// ProfileFormScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import { useNavigation } from "@react-navigation/native";
import { useRegisterContext } from "../context/RegisterContext";

const ProfileFormScreen = () => {
  const navigation = useNavigation();
  const { registerData, setRegisterData } = useRegisterContext(); // Importamos contexto

  // Inicializamos con los valores existentes en el contexto (por si el usuario regresa)
  const [name, setName] = useState(registerData.name || "");
  const [age, setAge] = useState(
    registerData.age ? registerData.age.toString() : ""
  );
  const [description, setDescription] = useState(registerData.description || "");

  const handleContinue = () => {
    if (!name || !age || !description) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    if (description.trim().split(/\s+/).length > 50) {
      Alert.alert("Error", "La descripción no debe exceder las 50 palabras.");
      return;
    }

    // Guardar en el contexto
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber)) {
      Alert.alert("Error", "La edad debe ser un número válido.");
      return;
    }

    setRegisterData({
      ...registerData,
      name,
      age: ageNumber,
      description,
    });

    navigation.navigate("Gender");
  };

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <Text style={styles.title}>Completa tu perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Descripción (máximo 50 palabras)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileFormScreen;

/* ========== ESTILOS ========== */
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
  input: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: "#E82561",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
