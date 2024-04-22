import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../Interfaces/Firebase';
import { coupageGeneric } from '../Interfaces/Method';
import { str } from '../Interfaces/Storage';

const Debts = () => {

  const [exp, setExpenses] = useState<GetExpense[]>([]);
  const [selectUser, setSelectedUser] = useState<string>('');
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);


  useEffect(() => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Format dates as strings
    const startOfMonthString = startOfMonth.toLocaleDateString();
    const endOfMonthString = endOfMonth.toLocaleDateString();

    const usersCollection = collection(db, 'users');

    const q = query(usersCollection,
      where('dateExp', '>=', startOfMonthString),
      where('dateExp', '<=', endOfMonthString),
      orderBy('dateExp', 'desc')
    );
    const subscribe = onSnapshot(q,{
      next:async (snapshot)=>{
        await str.getData("user", setSelectedUser);
        var value = await AsyncStorage.getItem('user');
        const todos: GetExpense[] = [];
        const ExpDebts = snapshot.docs.forEach((doc) => {
        const expense = doc.data();
      const amount = expense.amount;
      const paidBy = expense.paidBy;
      // Calculate Mohammed's share in the expense
      const participants = expense.participants;
      if (paidBy !== value) {
        participants.forEach((participant: Participants) => {
          if (participant.Value == value && !participant.Payed) {
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

    //str.getData("user", setSelectedUser)
    return ()=>subscribe();

  }, [])

  async function getTotalDebtForUser(userId: any) {
    let dataarr: any = [];
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Format dates as strings
    const startOfMonthString = startOfMonth.toLocaleDateString();
    const endOfMonthString = endOfMonth.toLocaleDateString();

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
      if (paidBy !== selectUser) {


        participants.forEach((participant: Participants) => {
          if (participant.Value == selectUser && !participant.Payed) {
            dataarr.push(expense);

          }

        });
      }


    })
    setExpenses(dataarr)

    return dataarr;
  }
  const renderItem = ({ item }: { item: GroupedData }) => (
    <View style={styles.group}>
      <View style={{ alignItems: 'center', backgroundColor: "#0101" }}>
        <Text style={[styles.date, { alignItems: 'baseline' }]}>All Paid By: {item.date}</Text>
        {/* <Text style={{}}>Total Of Debts: {item?.exp?.Debts}</Text> */}
        <Text style={{}}>Total Of Debts: {item?.exp}</Text>


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
                  <Text style={{ fontWeight: 'bold' }}>{transaction.description}</Text>
                  <Text>Amount: {transaction.amount}</Text>
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


  if (!exp) {
    return <View style={{flex: 1,
      justifyContent: 'center', // Vertically center content
      alignItems: 'center', }}><Text>Loading...</Text></View>;
  }
  return (
    // <View >
    //   <Button title={"Refrech All Debts for " + selectUser} onPress={() => {
    //     getTotalDebtForUser("test")
    //       .then((data) => {
    //         setExpenses(data);
    //         setGrouped(coupageGeneric(data,"paidBy"));

    //         console.log('Total debt with grouped', expGrouped );
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
    //               <View key={item.transaction} style={styles.expenseItem}>
    //                 <Text style={styles.description}>{item.description} Payed By {item.paidBy}</Text>
    //                 <Text style={styles.amount}>${(item.amount/item.participants.length).toFixed(2)}</Text>
    //               </View>
    //             </TouchableOpacity>

    //           )
    //         })
    //       ))
    //     }
    //   </View>



    // </View >
    <View style={styles.container}>
      {/* <Button title={"Refrech All Debts for " + selectUser} onPress={() => {
        getTotalDebtForUser("test")
          .then((data) => {
            setExpenses(data);
            setGrouped(coupageGeneric(data,"paidBy"));

            console.log('Total debt with grouped', expGrouped );
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }} /> */}
      <FlatList
        data={expGrouped}
        keyExtractor={(group) => group.date}
        renderItem={renderItem}
      />
    </View>
  )
}

export default Debts



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
