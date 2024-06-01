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
