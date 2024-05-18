// All dep Import
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for the context value
interface UsernameContextType {
  username: string;
  setUsername: (username: string) => void;
}

// Create the context with a default value
const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

// Custom hook to use the UsernameContext
const useUsername = () => {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error('useUsername must be used within a UsernameProvider');
  }
  return context;
};

// Context provider component
const UsernameProvider = ({ children }: { children: ReactNode }) => {
  // Providers declare

  //State Declare
  const [username, setUsernameState] = useState<string>('');

  // delare evet effect
 useEffect(() => {
    loadUsername();
  }, []);
  
  //Method Declare
  // Function to load the username from AsyncStorage
  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsernameState(storedUsername);
      }
    } catch (error) {
      console.error('Failed to load username from storage', error);
    }
  };
  // Function to save the username to AsyncStorage
  const saveUsername = async (username: string) => {
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.error('Failed to save username to storage', error);
    }
  };
  // Function to update the username state and persist it
  const setUsername = (username: string) => {
    setUsernameState(username);
    saveUsername(username);
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};

export { UsernameProvider, useUsername };
