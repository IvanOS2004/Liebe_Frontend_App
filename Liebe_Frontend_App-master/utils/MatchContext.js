// MatchContext.js
import React, { createContext, useState } from "react";

// Crear el contexto
export const MatchContext = createContext();

// Proveedor del contexto
export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  // Función para agregar un nuevo match
  const addMatch = (profile) => {
    setMatches((prevMatches) => [...prevMatches, profile]);
  };

  // Función para eliminar un match
  const removeMatch = (id) => {
    setMatches((prevMatches) => prevMatches.filter((match) => match.id !== id));
  };

  return (
    <MatchContext.Provider value={{ matches, addMatch, removeMatch }}>
      {children}
    </MatchContext.Provider>
  );
};
