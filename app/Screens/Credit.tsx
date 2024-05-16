import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../Interfaces/Firebase';
import { str } from '../Interfaces/Storage';
import { coupageGeneric } from '../Interfaces/Method';
import ListArray from '../Components/lists';
import { ThemeColor } from '../Interfaces/Themed';

const Credits = () => {
  const colorScheme = useColorScheme();


  const [exp, setExpenses] = useState<ExpenseCreadit[]>([]);
  const [selectUser, setSelectedUser] = useState<string>('');
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);


  useEffect(() => {

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    // Format dates as strings
    const startOfMonthString = startOfMonth.toLocaleDateString();
    const endOfMonthString = endOfMonth.toLocaleDateString();

    const usersCollection = collection(db, 'users');

    const q = query(usersCollection,
      where('createdAt', '>=', startOfMonth),
      where('createdAt', '<', endOfMonth),
      orderBy('createdAt', 'desc')
    )
    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {
        await str.getData("user", setSelectedUser);


        var value = await AsyncStorage.getItem('user');
        const todos: ExpenseCreadit[] = [];
        const ExpDebts = snapshot.docs.forEach((doc) => {
          const expense = doc.data();
          const amount = expense.amount;
          const paidBy = expense.paidBy;
          // Calculate Mohammed's share in the expense
          const participants = expense.participants;
          if (paidBy === value) {
            participants.forEach((participant: Participants) => {
              if (participant.Value !== value && !participant.Payed) {
                todos.push({ partName: participant.Value, ...expense } as ExpenseCreadit);
              }

            });
          }

        });//enf foreach
        setExpenses(todos)
        //var value = await AsyncStorage.getItem('LocalExpense');
        // if (value != null) {
        //   //console.log("Value ", value)

        // }
        setGrouped(coupageGeneric(todos, 'partName'));

      }
    })

    return () => subscribe();

  }, [])




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
      backgroundColor:ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background
    }}><Text style={{color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text}}>No Credit...</Text></View>;
  }

  return (

    <View style={[styles.container, { backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background}]}>

      {/* <FlatList
        data={expGrouped}
        keyExtractor={(group) => group.date}
        renderItem={renderItem}
      /> */}
      <ListArray Data={expGrouped} selectUser={selectUser} types='Credit'  />

    </View>
  )
}

export default Credits


