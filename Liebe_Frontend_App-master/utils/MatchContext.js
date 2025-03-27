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

  return (
    <MatchContext.Provider value={{ matches, addMatch }}>
      {children}
    </MatchContext.Provider>
  );
};
