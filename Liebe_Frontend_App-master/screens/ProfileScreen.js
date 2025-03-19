import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
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

  const {
    name: initialName,
    age: initialAge,
    gender: initialGender,
    description: initialDescription,
    interests: initialInterests,
    photos,
  } = profileData;

  // Estados para el modal y los datos del formulario
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState(initialName);
  const [age, setAge] = useState(initialAge.toString());
  const [gender, setGender] = useState(initialGender);
  const [selectedInterests, setSelectedInterests] = useState(initialInterests);
  const [description, setDescription] = useState(initialDescription);

  // Estado para controlar si se muestra el botón de editar
  const [isEditingImage, setIsEditingImage] = useState(false);

  // Lista de gustos predefinidos
  const predefinedInterests = [
    "Viajes",
    "Música",
    "Deportes",
    "Cine",
    "Tecnología",
    "Arte",
    "Lectura",
  ];

  // Opciones de género
  const genderOptions = ["Hombre", "Mujer", "Otro"];

  // Función para manejar la selección de gustos
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Función para guardar los cambios del formulario
  const handleSave = () => {
    if (!name || !age || !description) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    if (description.split(" ").length > 50) {
      Alert.alert("Error", "La descripción no debe exceder las 50 palabras.");
      return;
    }

    // Aquí puedes guardar los datos o enviarlos a una API
    Alert.alert("Éxito", "Tu perfil ha sido actualizado.");
    setIsModalVisible(false); // Cierra el modal después de guardar
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
            onPress={() => setIsEditingImage(!isEditingImage)}
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
            {selectedInterests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>

          {/* Botón de editar */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setIsModalVisible(true)} // Abrir el modal
          >
            <Text style={styles.saveButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal para editar el perfil */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={false}
        >
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <CustomNavBar />
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            {/* Campo para el nombre */}
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />

            {/* Campo para la edad */}
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            {/* Selector de género personalizado */}
            <View style={styles.genderSelectorContainer}>
              {genderOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.genderOption,
                    gender === option && styles.selectedGenderOption,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      gender === option && styles.selectedGenderOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Selector de gustos personalizado */}
            <View style={styles.interestsSelectorContainer}>
              {predefinedInterests.map((interest, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.interestOption,
                    selectedInterests.includes(interest) &&
                      styles.selectedInterestOption,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestOptionText,
                      selectedInterests.includes(interest) &&
                        styles.selectedInterestOptionText,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Campo para la descripción */}
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Descripción (máximo 50 palabras)"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Botón para guardar cambios */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            {/* Botón para cancelar */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>

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
  genderSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "100%",
  },
  genderOption: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E82561",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedGenderOption: {
    backgroundColor: "#E82561",
    borderColor: "#E82561",
  },
  genderOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedGenderOptionText: {
    color: "#fff",
  },
  interestsSelectorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  interestOption: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#E82561",
  },
  selectedInterestOption: {
    backgroundColor: "#E82561",
  },
  interestOptionText: {
    color: "#333",
    fontSize: 14,
  },
  selectedInterestOptionText: {
    color: "#fff",
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
  modalContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFE4CF",
    alignItems: "center",
  },
  modalTitle: {
    paddingTop: "20%",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#E82561",
  },
  input: {
    width: "100%",
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
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 18,
    color: "#000",
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
