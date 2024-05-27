// All dep Import
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirstAndLastDayOfMonth } from '../Interfaces/Method';
import { useSelector } from 'react-redux';

// Define the type for the context value
interface UsernameContextType {
  username: string;
  setUsername: (username: string) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  startOfm: Date;
  endOfm: Date;
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
  const user = useSelector((state: any) => state.user.user);
  const expenses = useSelector((state: any) => state.expense.expenses);



  //State Declare
  const [username, setUsernameState] = useState<string>(user);
  const [selectedMonth, setSelectedMonthState] = useState<number>(new Date().getMonth() + 1);
  const [startOfm, setStartOfmState] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endOfm, setEndOfmState] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1));
  // delare evet effect
  // useEffect(() => {
  //   // loadUsername();
  //   loadData();
  // }, []);

  //Method Declare
  // Function to load the username from AsyncStorage
  // const loadUsername = async () => {
  //   try {
  //     const storedUsername = await AsyncStorage.getItem('username');
  //     if (storedUsername) {
  //       setUsernameState(storedUsername);
  //     }
  //   } catch (error) {
  //     console.error('Failed to load username from storage', error);
  //   }
  // };
  const loadData = async () => {
    try {
     
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
    //setUsernameState(username);
    //saveUsername(username);
  };
  const setSelectedMonth = (month: number) => {
    setSelectedMonthState(month);
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(month, 2024);
    setStartOfmState(firstDay);
    setEndOfmState(lastDay);
  };


  return (
    <UsernameContext.Provider value={{ username, setUsername, selectedMonth, setSelectedMonth, startOfm, endOfm }}>
      {children}
    </UsernameContext.Provider>
  );
};

export { UsernameProvider, useUsername };
