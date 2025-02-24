import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomNavBar from "../components/CustomNavBar";

const InterestsScreen = () => {
  const navigation = useNavigation();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const animatedValues = useRef(
    Object.fromEntries(
      [
        "Deportes",
        "Música",
        "Cine",
        "Tecnología",
        "Viajes",
        "Lectura",
        "Cocina",
      ].map((interest) => [interest, new Animated.Value(1)])
    )
  ).current;

  const handleInterestPress = (interest) => {
    const isSelected = selectedInterests.includes(interest);

    if (isSelected) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }

    Animated.sequence([
      Animated.timing(animatedValues[interest], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[interest], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <Text style={styles.title}>Selecciona tus intereses</Text>
      <View style={styles.interestsContainer}>
        {Object.keys(animatedValues).map((interest, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleInterestPress(interest)}
          >
            <Animated.View
              style={[
                styles.interestButton,
                selectedInterests.includes(interest) &&
                  styles.selectedInterestButton,
                { transform: [{ scale: animatedValues[interest] }] },
              ]}
            >
              <Text style={styles.interestText}>{interest}</Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón para continuar */}
      {selectedInterests.length > 0 && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("ProfilePictureScreen")}
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
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  interestButton: {
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  selectedInterestButton: {
    backgroundColor: "#E82561",
    borderColor: "#FFFFFF",
  },
  interestText: {
    fontSize: 16,
    color: "#000",
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

export default InterestsScreen;
