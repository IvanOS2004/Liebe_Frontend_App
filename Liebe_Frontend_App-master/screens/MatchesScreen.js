import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { useRegisterContext } from "../context/RegisterContext";

const MatchesScreen = ({ navigation }) => {
  const { registerData } = useRegisterContext();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (registerData?._id) {
      fetchMatches();
    } else {
      setLoading(false);
      setError("No se pudo identificar al usuario");
    }
  }, [registerData?._id]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.1.70:3000/matches?userId=${registerData._id}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un array");
      }
      
      setMatches(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Error al cargar matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <CustomNavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E82561" />
        </View>
        <BottomNavBar navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomNavBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {matches.length > 0 ? (
          matches.map((match) => {
            if (!match.user1 || !match.user2) {
              return null;
            }
            
            const otherUser =
              match.user1._id === registerData._id ? match.user2 : match.user1;
            
            const photo = otherUser.photos?.[0] || 'https://via.placeholder.com/50';
            
            return (
              <TouchableOpacity 
                key={match._id} 
                style={styles.matchCard}
                onPress={() => navigation.navigate('Chat', { matchId: match._id })}
              >
                <Image
                  source={{ uri: photo }}
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {otherUser.name}, {otherUser.age}
                  </Text>
                  <Text style={styles.lastMessage}>Último mensaje...</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noMatchesContainer}>
            <Text style={styles.noMatchesText}>No tienes matches aún</Text>
          </View>
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#FFE4CF" },
  scrollContainer: { padding: 20, flexGrow: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15,
    backgroundColor: '#eee'
  },
  info: { flex: 1 },
  name: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#E82561'
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  noMatchesText: {
    fontSize: 18,
    color: '#666'
  }
});

export default MatchesScreen;