import React, { useEffect } from "react";
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
import { useChatContext } from "../context/ChatContext";
import { useRegisterContext } from "../context/RegisterContext";

const { height } = Dimensions.get("window");
const NAVBAR_HEIGHT = 60;
const BOTTOM_NAV_HEIGHT = 60;
const MARGIN = 40;

const ChatScreen = ({ navigation }) => {
  const { conversations, fetchConversations } = useChatContext();
  const { registerData } = useRegisterContext();

  useEffect(() => {
    if (registerData?._id) {
      fetchConversations(registerData._id);
    }
  }, [registerData]);

  // Para cada conversación, determinamos el otro participante y mostramos el último mensaje.
  const renderConversationItem = (conversation) => {
    // Suponemos que 'participants' es un arreglo con los objetos de usuario
    // y que el usuario actual es registerData._id.
    const otherUser = conversation.participants.find(
      (user) => user._id !== registerData._id
    );
    return (
      <TouchableOpacity
        key={conversation._id}
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("ChatRoom", {
            conversationId: conversation._id,
            chatName: otherUser.name,
            chatAvatar: otherUser.photos?.[0] || "https://via.placeholder.com/50",
            userId: registerData._id,
            otherUserId: otherUser._id,
          })
        }
      >
        <Image source={{ uri: otherUser.photos?.[0] || "https://via.placeholder.com/50" }} style={styles.avatar} />
        <View style={styles.chatInfo}>
          <Text style={styles.name}>{otherUser.name}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {conversation.lastMessage || "Sin mensajes"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Calculamos la altura para el contenedor de chats
  const scrollViewHeight =
    height - NAVBAR_HEIGHT - BOTTOM_NAV_HEIGHT - 2 * MARGIN;

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Navbar superior */}
      <View style={styles.topNavContainer}>
        <CustomNavBar />
      </View>

      {/* Lista de conversaciones */}
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
          {conversations && conversations.length > 0 ? (
            conversations.map(renderConversationItem)
          ) : (
            <Text style={styles.noChatsText}>No tienes conversaciones.</Text>
          )}
        </ScrollView>
      </View>

      {/* Navbar inferior */}
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
  chatItem: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  noChatsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
});

export default ChatScreen;
