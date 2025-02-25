import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useFonts, Oswald_400Regular } from "@expo-google-fonts/oswald";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync(); // Evita que la pantalla de carga desaparezca antes de tiempo

const CustomNavBar = () => {
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Oculta el splash cuando las fuentes cargan
      setAppReady(true);
    }
  }, [fontsLoaded]);

  if (!appReady) {
    return null; // No renderiza nada hasta que las fuentes estén listas
  }

  return (
    <View style={styles.navBar}>
      <Image source={require("../assets/logo_liebe.png")} style={styles.logo} />
      <Text style={styles.title}>Liebe</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Alinea a la derecha
    backgroundColor: "#E82561",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingTop: 10,
    paddingHorizontal: 20, // Espaciado a los lados
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain", // Asegura que el logo no se corte
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Oswald_400Regular",
    color: "#ffffff",
  },
});

export default CustomNavBar;
