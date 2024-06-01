// All dep Import
import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { coupage, coupageGeneric } from '../Interfaces/Method';
import { db } from '../Interfaces/Firebase';
import ListArray from '../Components/lists';
import { ThemeColor } from '../Interfaces/Themed';
import { useUsername } from '../Components/userName';
import { useSelector } from 'react-redux';

const Expenses = () => {
  // Providers declare
  const colorScheme = useColorScheme();
  const { username, selectedMonth, endOfm, startOfm } = useUsername();
  const params = useSelector((state: any) => state.params);

  //State Declare
  const [exp, setExpenses] = useState<GetExpense[]>([]);
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);

  // delare evet effect
  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection,
      where('createdAt', '>=', startOfm),
      where('createdAt', '<', endOfm),
      //where('cat','!=','Deposit'),
      orderBy('createdAt', 'desc')
    )
    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {
        if (username == null || username == "")
          return;
        const todos: GetExpense[] = [];
        const Todos = snapshot.docs.forEach((doc) => {
          const expense: Expense = doc.data() as Expense;
          const amount = expense.amount;
          const paidBy = expense.paidBy;
          // Calculate Mohammed's share in the expense
          const participants: Participants[] = expense.participants;
          if (paidBy === username) {
            if (participants.filter((item: Participants) => !item.Payed && item.Value != username).length > 0) {
              todos.push({
                id: doc.id,
                ...doc.data()
              } as GetExpense);

            }

            else if (participants.filter((item: Participants) => item.Value === username).length === 1) {
              todos.push({
                id: doc.id,
                ...doc.data()
              } as GetExpense);
            }
          } else {
            if (participants.filter((item: Participants) => item.Value === username && item.Payed == true).length === 1) {
              todos.push({
                id: doc.id,
                ...doc.data()
              } as GetExpense);
            }
          }
        })
        setExpenses(todos);
        //setGrouped(coupage(todos, 'cat', "" + username));

        setGrouped(coupage(todos, params.filterBy, "" + username));
      }
    });

    return () => subscribe();
  }, [params,selectedMonth])
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
    }}><Text>Loading...</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background }]}>
      <Text style={{
        justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text
      }}>All Expenses For User : {username}</Text>
      <ListArray Data={expGrouped} selectUser={username} types='Expenses' />

    </View>

  )
}

export default Expenses



