import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { str } from '../Interfaces/Storage';
import { coupage } from '../Interfaces/Method';
import { db } from '../Interfaces/Firebase';
import ListArray from '../Components/lists';
import { ThemeColor } from '../Interfaces/Themed';


const Expenses = () => {
  const colorScheme = useColorScheme();


  const [exp, setExpenses] = useState<GetExpense[]>([]);
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);

  const [selectUser, setSelectedUser] = useState<string>('');

  useEffect(() => {

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // Format dates as strings
    const startOfMonthString = startOfMonth.toLocaleDateString();
    const endOfMonthString = endOfMonth.toLocaleDateString();

    const usersCollection = collection(db, 'users');


    const q = query(usersCollection,
      // where('dateExp', '>=', startOfMonthString),
      // where('dateExp', '<=', endOfMonthString),
      where('createdAt', '>=', startOfMonth),
      where('createdAt', '<', endOfMonth),
      orderBy('createdAt', 'desc')
    )

    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {
        await str.getData("user", setSelectedUser);
        var value = await AsyncStorage.getItem('user');
        if (value == null)
          return;
        const todos: GetExpense[] = [];
        const Todos = snapshot.docs.forEach((doc) => {
          const expense: Expense = doc.data() as Expense;
          const amount = expense.amount;
          const paidBy = expense.paidBy;

          // Calculate Mohammed's share in the expense
          const participants: Participants[] = expense.participants;
          if (paidBy === value) {
            if (participants.filter((item: Participants) => !item.Payed && item.Value != value).length > 0) {
              todos.push({
                id: doc.id,
                ...doc.data()
              } as GetExpense);

            }

            else if (participants.filter((item: Participants) => item.Value === value).length === 1) {
              todos.push({
                id: doc.id,
                ...doc.data()
              } as GetExpense);
            }
          } else {
            if (participants.filter((item: Participants) => item.Value === value && item.Payed == true).length === 1
            ) {


              todos.push({
                id: doc.id,
                ...doc.data()
              } as GetExpense);
            }

          }



          //alert(doc.metadata.fromCache)
        })
        setExpenses(todos)
        setGrouped(coupage(todos, 'dateExp', "" + value));
      }
    });

    return () => subscribe();
  }, [])







  if (expGrouped.length == 0) {
    return <View style={{
      flex: 1,
      justifyContent: 'center', // Vertically center content
      alignItems: 'center',
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background
    }}><Text>Loading...</Text></View>;
  }
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
  return (
    <View style={[styles.container, { backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background }]}>
      <Text style={{
        justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text
      }}>All Expenses For User : {selectUser}</Text>
      {/* <FlatList
        data={expGrouped}
        keyExtractor={(group) => group.date}
        renderItem={renderItem}
      /> */}
      <ListArray Data={expGrouped} selectUser={selectUser} types='Expenses' />

    </View>

  )
}

export default Expenses



