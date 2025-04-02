import React, { useState, useEffect } from "react";
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
  ActivityIndicator
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { useRegisterContext } from "../context/RegisterContext";
import Config from '../utils/config';

const ProfileScreen = ({ navigation }) => {
  const { registerData, setRegisterData } = useRegisterContext();
  
  // Estados para el modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempName, setTempName] = useState(registerData?.name || "");
  const [tempAge, setTempAge] = useState(registerData?.age?.toString() || "");
  const [tempGender, setTempGender] = useState(registerData?.gender || "");
  const [tempInterests, setTempInterests] = useState(registerData?.interests || []);
  const [tempDescription, setTempDescription] = useState(registerData?.description || "");
  const [isSaving, setIsSaving] = useState(false);

  // Lista de intereses predefinidos
  const predefinedInterests = [
    "Viajes",
    "Música",
    "Deportes",
    "Cine",
    "Tecnología",
    "Arte",
    "Lectura",
  ];

  const genderOptions = ["Hombre", "Mujer", "Otro"];

  const toggleInterest = (interest) => {
    if (tempInterests.includes(interest)) {
      setTempInterests(tempInterests.filter(item => item !== interest));
    } else {
      setTempInterests([...tempInterests, interest]);
    }
  };

  const handleModalSave = () => {
    const updatedData = {
      ...registerData,
      name: tempName,
      age: parseInt(tempAge, 10) || 0,
      gender: tempGender,
      interests: tempInterests,
      description: tempDescription,
    };
    setRegisterData(updatedData);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `${Config.API.BASE_URL}${Config.API.ENDPOINTS.PROFILE}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        // Mostrar modal de confirmación
        setShowConfirmationModal(true);
        
        try {
          // Hacer relogueo automático
          const loginResponse = await fetch(
            `${Config.API.BASE_URL}${Config.API.ENDPOINTS.LOGIN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: registerData.email,
              password: registerData.password
            }),
          });
          
          if (!loginResponse.ok) {
            throw new Error("Error en relogueo");
          }

          const loginData = await loginResponse.json();
          
          // Verificar estructura de la respuesta
          if (loginData.user) {
            setRegisterData(loginData.user);
          } else {
            console.error("Estructura de respuesta inválida:", loginData);
          }
        } catch (loginError) {
          console.error("Error en relogueo automático:", loginError);
        }
      } else {
        Alert.alert("Error", result.message || "Error al actualizar perfil");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error de conexión al actualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileImage = () => {
    const crop = registerData?.crop || { translationX: 0, translationY: 0, scale: 1 };
    
    if (registerData?.photos?.[0]) {
      return (
        <Image
          source={{ uri: `data:image/jpeg;base64,${registerData.photos[0]}` }}
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
      );
    }
    return (
      <View style={styles.placeholderImage}>
        <Text style={styles.placeholderText}>Sin imagen</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <CustomNavBar />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => navigation.navigate("ProfilePictureScreen")}
          >
            {renderProfileImage()}
          </TouchableOpacity>

          <View style={styles.basicInfoContainer}>
            <Text style={styles.nameText}>{registerData?.name || "Nombre no disponible"}</Text>
            <Text style={styles.ageGenderText}>
              {registerData?.age || "0"} años · {registerData?.gender || "No especificado"}
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{registerData?.description || "Sin descripción"}</Text>
          </View>

          <View style={styles.interestsContainer}>
            {registerData?.interests?.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Perfil</Text>
            )}
          </TouchableOpacity>

          <Modal visible={isModalVisible} animationType="slide">
            <ScrollView contentContainerStyle={styles.modalContainer}>
              <CustomNavBar />
              <Text style={styles.modalTitle}>Editar Perfil</Text>

              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={tempName}
                onChangeText={setTempName}
              />

              <TextInput
                style={styles.input}
                placeholder="Edad"
                value={tempAge}
                onChangeText={setTempAge}
                keyboardType="numeric"
              />

              <View style={styles.genderSelectorContainer}>
                {genderOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.genderOption,
                      tempGender === option && styles.selectedGenderOption,
                    ]}
                    onPress={() => setTempGender(option)}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      tempGender === option && styles.selectedGenderOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.interestsSelectorContainer}>
                {predefinedInterests.map((interest, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.interestOption,
                      tempInterests.includes(interest) && styles.selectedInterestOption,
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text style={[
                      styles.interestOptionText,
                      tempInterests.includes(interest) && styles.selectedInterestOptionText
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Descripción (máximo 50 palabras)"
                value={tempDescription}
                onChangeText={setTempDescription}
                multiline
              />

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleModalSave}
              >
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleModalCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </Modal>
        </ScrollView>

        <BottomNavBar navigation={navigation} />
      </View>

      {/* Modal de Confirmación */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.confirmationModalBackdrop}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationModalText}>¡Perfil guardado con éxito!</Text>
            <TouchableOpacity
              style={styles.confirmationModalButton}
              onPress={() => {
                setShowConfirmationModal(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'ProfileScreen' }],
                });
              }}
            >
              <Text style={styles.confirmationModalButtonText}>Aceptar</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
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
  confirmationModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  confirmationModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#E82561',
  },
  confirmationModalButton: {
    backgroundColor: '#E82561',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  confirmationModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;