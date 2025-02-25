import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Match")}
      >
        <Text style={styles.navText}>Match</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navText}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
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
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navButton: {
    padding: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BottomNavBar;
