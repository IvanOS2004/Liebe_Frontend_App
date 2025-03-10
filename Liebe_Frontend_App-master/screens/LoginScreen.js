import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.102:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Navegar a pantalla principal o lo que desees
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error de conexión");
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <View style={styles.loginBox}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Accede a tu cuenta para continuar</Text>

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

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text
          style={styles.registerText}
          onPress={() => navigation.navigate("Register")}
        >
          ¿No tienes una cuenta?{" "}
          <Text style={{ fontWeight: "bold" }}>Regístrate</Text>
        </Text>

        <Text style={styles.socialLoginText}>Iniciar sesión desde</Text>

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
  loginBox: {
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
  loginButton: {
    backgroundColor: "#E82561",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
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

export default LoginScreen;
