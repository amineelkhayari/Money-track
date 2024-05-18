// All dep Import
import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../Interfaces/Firebase';
import { coupageGeneric } from '../Interfaces/Method';
import { str } from '../Interfaces/Storage';
import { ThemeColor } from '../Interfaces/Themed';
import ListArray from '../Components/lists';
import { useUsername } from '../Components/userName';

const Debts = () => {
  // Providers declare

  const colorScheme = useColorScheme();
  const { username } = useUsername();

  //State Declare

  const [exp, setExpenses] = useState<GetExpense[]>([]);
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);

  // delare evet effect

  useEffect(() => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection,
      where('createdAt', '>=', startOfMonth),
      where('createdAt', '<', endOfMonth),
      orderBy('createdAt', 'desc')
    );
    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {
        const todos: GetExpense[] = [];
        const ExpDebts = snapshot.docs.forEach((doc) => {
          const expense = doc.data();
          const amount = expense.amount;
          const paidBy = expense.paidBy;
          // Calculate Mohammed's share in the expense
          const participants = expense.participants;
          if (paidBy !== username) {
            participants.forEach((participant: Participants) => {
              if (participant.Value == username && !participant.Payed) {
                todos.push({
                  id: doc.id,
                  ...doc.data()
                } as GetExpense);
              }

            });
          }

        });
        setExpenses(todos)
        setGrouped(coupageGeneric(todos, 'paidBy'));


      }
    })
    return () => subscribe();

  }, [username]);

  //Method Declare
  //styles Declare

  const styles = StyleSheet.create({
    div: {
      height: 1, // Adjust height as needed
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary, // Adjust color as needed
      marginVertical: 10, // Adjust vertical spacing as needed
    },
    divider: {
      height: 3, // Adjust height as needed
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary, // Adjust color as needed
      marginVertical: 10, // Adjust vertical spacing as needed
    },
    container: {
      flex: 1,
    },
    group: {
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    date: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
    },
    transaction: {
      padding: 15,
      backgroundColor:
        ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
      borderRadius: 8,
      marginBottom: 10,
      shadowColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
      flexDirection: 'row',
      justifyContent: 'space-around',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    description: {
      fontSize: 16,
      marginBottom: 5,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
    },
    amount: {
      fontSize: 14,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
    }
  });

  if (expGrouped.length == 0) {
    return <View style={{
      flex: 1,
      justifyContent: 'center', // Vertically center content
      alignItems: 'center',
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background
    }}><Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>You Don't any Debts ...</Text></View>;
  }
  return (
    <View style={[styles.container, { backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background }]}>
      <ListArray Data={expGrouped} selectUser={username} types='Debts' />
    </View>
  )
}

export default Debts
