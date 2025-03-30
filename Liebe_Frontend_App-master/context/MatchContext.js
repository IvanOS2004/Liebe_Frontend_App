import React, { createContext, useState, useContext } from "react"; // Añadido useContext

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  const addMatch = (newMatch) => {
    setMatches(prev => [...prev, newMatch]);
  };

  const removeMatch = async (matchId) => {
    try {
      const response = await fetch(
        `http://192.168.1.70:3000/matches/${matchId}`, 
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el match");
      }

      // Si la eliminación fue exitosa, actualizamos el estado
      setMatches((prev) => prev.filter((match) => match._id !== matchId));

    } catch (error) {
      console.error("Error al eliminar el match:", error);
      throw error; // Permite manejar el error en la interfaz
    }
  };


  return (
    <MatchContext.Provider value={{ matches, addMatch, removeMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatchContext = () => useContext(MatchContext);