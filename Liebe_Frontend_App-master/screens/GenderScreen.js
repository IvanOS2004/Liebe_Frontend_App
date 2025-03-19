import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import { useNavigation } from "@react-navigation/native";
import { useRegisterContext } from "../context/RegisterContext";

const GenderScreen = () => {
  const navigation = useNavigation();
  const { registerData, setRegisterData } = useRegisterContext();
  const [selectedGender, setSelectedGender] = useState(
    registerData.gender || null
  );

  const genders = [
    "XY (Masculino biologico)",
    "XX (Femenino biologico)",
    "Otro",
  ];

  const handleContinue = () => {
    setRegisterData({ ...registerData, gender: selectedGender });
    navigation.navigate("Interests");
  };

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <Text style={styles.title}>Selecciona tu género</Text>
      {genders.map((gender, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.genderButton,
            selectedGender === gender && styles.selectedGenderButton,
          ]}
          onPress={() => setSelectedGender(gender)}
        >
          <Text style={styles.genderText}>{gender}</Text>
        </TouchableOpacity>
      ))}
      {selectedGender && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 5,
  },
  genderButton: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  selectedGenderButton: {
    backgroundColor: "#E82561",
    borderColor: "FFFFFF",
  },
  genderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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

export default GenderScreen;
