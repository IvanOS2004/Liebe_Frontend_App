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
    left: 0, // Asegura que comience desde el borde izquierdo
    right: 0, // Asegura que termine en el borde derecho
    width: "100%", // Ocupa todo el ancho
    height: 80, // Altura fija para la barra de navegación
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Alinea a la izquierda
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
