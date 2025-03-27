import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { Ionicons } from "@expo/vector-icons";
import { MatchContext } from "../utils/MatchContext";

const { height } = Dimensions.get("window");

const NAVBAR_HEIGHT = 60;
const BOTTOM_NAV_HEIGHT = 60;
const MARGIN = 40;

const MatchesScreen = ({ navigation }) => {
  const { matches } = useContext(MatchContext); // Obtener la lista de matches del contexto

  // Calculamos la altura disponible para el ScrollView
  const scrollViewHeight =
    height - NAVBAR_HEIGHT - BOTTOM_NAV_HEIGHT - 2 * MARGIN;

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Navbar superior fija */}
      <View style={styles.topNavContainer}>
        <CustomNavBar />
      </View>

      {/* Contenedor de matches con scroll */}
      <View
        style={[
          styles.chatContainer,
          {
            height: scrollViewHeight,
            marginTop: NAVBAR_HEIGHT + MARGIN,
            marginBottom: BOTTOM_NAV_HEIGHT + MARGIN,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {matches.length > 0 ? (
            matches.map((item) => (
              <View key={item.id} style={styles.profileItem}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.profileAvatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {item.name}, {item.age}
                  </Text>
                  <Text style={styles.profileLocation}>{item.location}</Text>
                </View>
                <View style={styles.profileActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="close" size={24} color="#FF5864" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart" size={24} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noMatchesText}>No tienes matches aún.</Text>
          )}
        </ScrollView>
      </View>

      {/* Navbar inferior fija */}
      <View style={styles.bottomNavContainer}>
        <BottomNavBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFE4CF",
  },
  topNavContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 10,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_NAV_HEIGHT,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
    zIndex: 10,
  },
  chatContainer: {
    width: "100%",
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileLocation: {
    fontSize: 14,
    color: "#666",
  },
  profileActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 10,
    padding: 10,
  },
  noMatchesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});

export default MatchesScreen;
