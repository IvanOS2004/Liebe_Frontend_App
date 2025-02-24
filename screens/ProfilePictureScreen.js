import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import CustomNavBar from "../components/CustomNavBar";

const ProfilePictureScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomNavBar />
      <Text style={styles.title}>Sube tu foto de perfil</Text>
      {/* Aquí puedes agregar un ImagePicker o botón de selección de imagen */}
      <Button
        title="Continuar"
        onPress={() => navigation.navigate("NextScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4CF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ProfilePictureScreen;
