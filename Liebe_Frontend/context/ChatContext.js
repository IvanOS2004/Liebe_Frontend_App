import React, { createContext, useState, useContext } from "react";
import Config from '../utils/config';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // almacenaremos mensajes por conversación

  // Obtener conversaciones de un usuario
  const fetchConversations = async (userId) => {
    try {
      const response = await fetch(
        `${Config.API.BASE_URL}${Config.API.ENDPOINTS.CONVERSATIONS}?userId=${userId}`
      );
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      console.error("Error al obtener conversaciones:", err);
    }
  };

  // Obtener mensajes de una conversación
  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `${Config.API.BASE_URL}${Config.API.ENDPOINTS.MESSAGES}/${conversationId}`
      );
      const data = await response.json();
      setMessages((prev) => ({ ...prev, [conversationId]: data }));
    } catch (err) {
      console.error("Error al obtener mensajes:", err);
    }
  };

  // Enviar un mensaje
  const sendMessage = async (conversationId, sender, receiver, messageText) => {
    try {
      const response = await fetch(
        `${Config.API.BASE_URL}${Config.API.ENDPOINTS.MESSAGES}`, 
        {
          method: "POST",
          headers: Config.API.HEADERS,
          body: JSON.stringify({ conversationId, sender, receiver, message: messageText }),
        }
      );
      const data = await response.json();
      // Agregar el mensaje a la conversación correspondiente en el estado
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), data],
      }));
    } catch (err) {
      console.error("Error al enviar el mensaje:", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        fetchConversations,
        fetchMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
