import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts, Oswald_400Regular } from "@expo-google-fonts/oswald";

const BottomNavBar = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
  });

  if (!fontsLoaded) {
    return null; // No renderiza nada hasta que las fuentes estén listas
  }

  return (
    <View style={[styles.navContainer, { paddingBottom: insets.bottom }]}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Match")}
      >
        <Text style={styles.navText}>Match</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Chat")}
      >
        <Text style={styles.navText}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.navText}>Matches</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E82561",
    paddingVertical: 15,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#ccc", // Borde superior similar al de CustomNavBar
    shadowColor: "#000", // Sombra para coincidir con el estilo
    shadowOffset: { width: 0, height: -2 }, // Sombra hacia arriba
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Oswald_400Regular", // Usa la misma fuente que CustomNavBar
  },
});

export default BottomNavBar;
