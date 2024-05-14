import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';

import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../Interfaces/Firebase';
import { str } from '../Interfaces/Storage';
import { coupageGeneric } from '../Interfaces/Method';

const Credits = () => {

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
        var value = await AsyncStorage.getItem('LocalExpense');
        // if (value != null) {
        //   //console.log("Value ", value)

        // }
        setGrouped(coupageGeneric(todos, 'partName'));

      }
    })

    return () => subscribe();

  }, [])




  if (expGrouped.length == 0) {
    return <View style={{
      flex: 1,
      justifyContent: 'center', // Vertically center content
      alignItems: 'center',
    }}><Text>No Credit...</Text></View>;
  }
  const renderItem = ({ item }: { item: GroupedData }) => (
    <View style={styles.group}>
      <View style={{ alignItems: 'center', backgroundColor: "#0101" }}>
        <Text style={[styles.date, { alignItems: 'baseline' }]}>All Credit For : {item.date}</Text>
        <Text style={{}}>Total Of Credit: {item?.exp}</Text>

      </View>
      <FlatList
        data={item.data}
        keyExtractor={(transaction) => transaction.transaction}
        renderItem={({ item: transaction }) => (
          <>
            <TouchableOpacity
              key={transaction.transaction}
              onPress={() => {
                router.push(
                  {
                    pathname: 'Screens/Detail', params: { id: transaction.transaction }
                  }
                )
              }}>

              <View style={[styles.transaction, { backgroundColor: transaction.paidBy === selectUser ? "green" : "grey" }]}>
                <View>
                <Text style={{ fontWeight: 'bold' }}>{transaction.description} type : {transaction.cat}</Text>
                  <Text>At: {transaction.timeExp}</Text>
                </View>
                <View>
                  <Text>Parts: {transaction.participants.length}</Text>
                  <Text>Amount: {(transaction.amount / transaction.participants.length).toFixed(2)}/ {transaction.amount}</Text>
                </View>

              </View>

            </TouchableOpacity>
            <View style={styles.div} />

          </>

        )}
      />
      <View style={styles.divider} />

    </View>
  );
  return (

    <View style={styles.container}>

      <FlatList
        data={expGrouped}
        keyExtractor={(group) => group.date}
        renderItem={renderItem}
      />
    </View>
  )
}

export default Credits




const styles = StyleSheet.create({
  div: {
    height: 1, // Adjust height as needed
    backgroundColor: 'gray', // Adjust color as needed
    marginVertical: 10, // Adjust vertical spacing as needed
  },
  divider: {
    height: 3, // Adjust height as needed
    backgroundColor: 'red', // Adjust color as needed
    marginVertical: 10, // Adjust vertical spacing as needed
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  group: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transaction: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
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
    color: '#333',
  },
  amount: {
    fontSize: 14,
    color: '#666',
  }
});
