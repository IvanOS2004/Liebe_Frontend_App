import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useChatContext } from "../context/ChatContext";

const ChatRoomScreen = ({ navigation, route }) => {
  // Obtenemos los parámetros de la navegación
  const { conversationId, chatName, chatAvatar, userId, otherUserId } = route.params;
  const { messages, fetchMessages, sendMessage } = useChatContext();
  const [inputText, setInputText] = useState("");

  // Referencia para el ScrollView (para auto-scroll)
  const scrollViewRef = useRef();

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  // Se actualiza cada vez que cambian los mensajes para auto-scroll
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, conversationId]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessage(conversationId, userId, otherUserId, inputText);
      setInputText("");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Image source={{ uri: chatAvatar }} style={styles.profileAvatar} />
        <Text style={styles.profileName}>{chatName}</Text>
      </View>

      {/* Área de mensajes */}
      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {(messages[conversationId] || []).map((message) => (
          <View
            key={message._id}
            style={[
              styles.messageBubble,
              message.sender === userId ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.message}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Entrada de mensaje */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#E82561" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFE4CF",
  },
  topBar: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#E82561",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    marginRight: 10,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  profileName: {
    fontSize: 24,
    fontFamily: "Oswald_400Regular",
    color: "#ffffff",
    marginLeft: 10,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
  },
  messageText: {
    fontSize: 16,
    fontFamily: "Oswald_400Regular",
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#ccc",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontFamily: "Oswald_400Regular",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});

export default ChatRoomScreen;
