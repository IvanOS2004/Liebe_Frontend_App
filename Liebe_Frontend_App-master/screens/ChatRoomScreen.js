import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons"; // Para los íconos

const ChatRoomScreen = ({ navigation, route }) => {
  // Obtener el nombre y el avatar del chat desde los parámetros de navegación
  const { chatName, chatAvatar } = route.params;

  // Estado para los mensajes
  const [messages, setMessages] = useState([
    { id: "1", text: "Hola, ¿cómo estás?", sender: "other" },
    { id: "2", text: "¡Hola! Estoy bien, ¿y tú?", sender: "me" },
    {
      id: "3",
      text: "Todo bien por aquí. ¿Qué planes tienes?",
      sender: "other",
    },
  ]);

  // Estado para el texto del mensaje
  const [inputText, setInputText] = useState("");

  // Función para enviar un mensaje
  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        text: inputText,
        sender: "me",
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Parte superior: Barra de perfil */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Image source={{ uri: chatAvatar }} style={styles.profileAvatar} />
        <Text style={styles.profileName}>{chatName}</Text>
      </View>

      {/* Área de mensajes */}
      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        ref={(ref) => (this.scrollView = ref)}
        onContentSizeChange={() =>
          this.scrollView.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Parte inferior: Área de entrada de texto */}
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
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
    width: "100%", // Ocupa todo el ancho
    height: 80, // Altura fija para la barra de navegación
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "flex-start", // Alinea a la izquierda
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
    backgroundColor: "#DCF8C6", // Color para mensajes enviados
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE", // Color para mensajes recibidos
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
