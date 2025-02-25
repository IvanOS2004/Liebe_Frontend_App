// GenderScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native"; // [MODIFICADO]
import CustomNavBar from "../components/CustomNavBar";
import { useNavigation } from "@react-navigation/native";
import { useRegisterContext } from "../context/RegisterContext";

const GenderScreen = () => {
  const navigation = useNavigation();
  const { registerData, setRegisterData } = useRegisterContext();
  const [selectedGender, setSelectedGender] = useState(registerData.gender || null); // [MODIFICADO]

  const genders = ["XY (Masculino biologico)", "XX (Femenino biologico)", "Otro"];

  const handleContinue = () => {
    setRegisterData({ ...registerData, gender: selectedGender }); // [MODIFICADO]
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
      <Button
        title="Continuar"
        onPress={handleContinue} // [MODIFICADO]
        disabled={!selectedGender}
      />
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
});

export default GenderScreen;
