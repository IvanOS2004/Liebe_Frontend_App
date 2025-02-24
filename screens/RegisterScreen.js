import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <View style={styles.registerBox}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>Crea una cuenta y únete a nosotros</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Gender")}
        >
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          ¿Ya tienes una cuenta?{" "}
          <Text style={{ fontWeight: "bold" }}>Inicia Sesión</Text>
        </Text>

        <Text style={styles.socialLoginText}>Registrarse con</Text>

        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Image
              source={require("../assets/adaptive-icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/adaptive-icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/adaptive-icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
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
  registerBox: {
    width: "90%",
    height: "75%",
    backgroundColor: "#FFE4CF",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  registerButton: {
    backgroundColor: "#E82561",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#000",
    fontSize: 14,
    textAlign: "center",
  },
  socialLoginText: {
    marginTop: 30,
    fontSize: 14,
    fontWeight: "bold",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    resizeMode: "contain",
  },
});

export default RegisterScreen;
