import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, orderBy, query, where,serverTimestamp, Timestamp } from 'firebase/firestore';

import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { str } from '../Interfaces/Storage';
import { coupage } from '../Interfaces/Method';
import { db } from '../Interfaces/Firebase';


const Expenses = () => {

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
  async function getTotalDebtForUser(userId: string) {
    let dataarr: any = [];
    const ExpensesData: GetExpense[] = [];
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Format dates as strings
    const startOfMonthString = startOfMonth.toISOString();
    const endOfMonthString = endOfMonth.toISOString();

    const usersCollection = collection(db, 'users');

    const q = query(usersCollection,
      where('dateExp', '>=', startOfMonthString),
      where('dateExp', '<=', endOfMonthString)
    )
    // Get all users
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const expense = doc.data();
      const amount = expense.amount;
      const paidBy = expense.paidBy;

      // Calculate Mohammed's share in the expense
      const participants = expense.participants;
      if (paidBy === userId) {
        if (participants.filter((item: Participants) => !item.Payed && item.Value != userId).length > 0) {
          dataarr.push(expense);
          ExpensesData.push({
            id: doc.id,
            ...expense
          } as GetExpense)

        }

        else if (participants.filter((item: Participants) => item.Value === userId).length === 1) {
          dataarr.push(expense);
          ExpensesData.push({
            id: doc.id,
            ...expense
          } as GetExpense)
        }
      } else {
        if (participants.filter((item: Participants) => item.Value === userId && item.Payed == true).length === 1
        ) {
          dataarr.push(expense);

          ExpensesData.push({
            id: doc.id,
            ...expense
          } as GetExpense)
        }

      }


    })
    // console.log("Get Expense: ", ExpensesData)

    return dataarr;
  }
  const convertDate = (newdt: any) => {
    var parts = newdt.split("/"); // Split the string into parts

    // Format the date as "YYYY-MM-DD"
    var formattedDate = parts[2] + "-" + parts[0].padStart(2, '0') + "-" + parts[1].padStart(2, '0');

    // Create a new Date object from the formatted date string
    var dateObject = new Date(formattedDate);


    return dateObject.toDateString(); //new Date(""+newdt).toDateString();
  }

  const renderItem = ({ item }: { item: GroupedData }) => (
    <View style={styles.group}>
      <View style={{ alignItems: 'center', backgroundColor: "#0101" }}>
        <Text style={[styles.date, { alignItems: 'baseline' }]}>{convertDate(item.date.toString())}</Text>
        <Text style={{}}>Exp: {item?.exp?.Expense} | Credit: {item?.exp?.Credit} | Debts: {item?.exp?.Debts}</Text>
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
              <Text style={{ fontWeight: 'bold' }}> + Payed By: {transaction.paidBy}</Text>

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






  if (expGrouped.length == 0) {
    return <View style={{
      flex: 1,
      justifyContent: 'center', // Vertically center content
      alignItems: 'center',
    }}><Text>Loading...</Text></View>;
  }
  return (
    <View style={styles.container}>
      <Text style={{ justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>All Expenses For User : {selectUser}</Text>
      <FlatList
        data={expGrouped}
        keyExtractor={(group) => group.date}
        renderItem={renderItem}
      />
    </View>
    // <View>
    //   <Button title={"Refrech All Expens for " + selectUser} onPress={() => {
    //     getTotalDebtForUser(selectUser)
    //       .then((data) => {
    //         setExpenses(data);
    //         console.log(selectUser + 'T ' + data.length, data);
    //       })
    //       .catch((error) => {
    //         console.error('Error:', error);
    //       });
    //   }} />
    //   <View>
    //     {
    //       (exp?.length > 0 && (
    //         exp.map((item: Expense) => {
    //           return (

    //             <TouchableOpacity
    //               key={item.transaction}
    //               onPress={() => {
    //                 router.push(
    //                   {
    //                     pathname: '/detail/detail', params: { id: item.transaction }
    //                   }
    //                 )
    //               }}>
    //               <View style={styles.expenseItem}>

    //                 <Text style={styles.description}>{item.description} Payed By ={item.paidBy}:</Text>
    //                 <Text style={styles.amount}>${(item.amount/item.participants.length).toFixed(2)}/{item.amount.toFixed(2)}</Text>
    //               </View>
    //             </TouchableOpacity>
    //           )
    //         })
    //       ))
    //     }
    //   </View>



    // </View>
  )
}

export default Expenses


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
