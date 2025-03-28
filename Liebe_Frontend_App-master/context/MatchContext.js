import React, { createContext, useState, useContext } from "react"; // Añadido useContext

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  const addMatch = (newMatch) => {
    setMatches(prev => [...prev, newMatch]);
  };

  return (
    <MatchContext.Provider value={{ matches, addMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatchContext = () => useContext(MatchContext);