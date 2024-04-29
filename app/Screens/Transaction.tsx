import { View, Text, SafeAreaView, StyleSheet, StatusBar, Button, Alert, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../Interfaces/Firebase';
import { str } from '../Interfaces/Storage';
import { users } from '../Interfaces/Users';
import Dashboard from '../Components/Dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { coupageGeneric } from '../Interfaces/Method';
import NetInfo from "@react-native-community/netinfo";
import * as Updates from 'expo-updates';
async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();

    }
  } catch (error) {
    // You can also add an alert() here if needed for your purposes
    console.log(`Error fetching latest Expo update: ${error}`);
  }
}

const History = () => {

  const [selectedUser, setSelectedUser] = useState<string>('');

  const [Calculate, setCalculate] = useState<any>();
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);
  const [inputValue, setInputValue] = useState('');

  const {
    currentlyRunning,
    availableUpdate,
    isUpdateAvailable,
    isUpdatePending
  } = Updates.useUpdates();

  // Define a function to get the total debt for a specific user
  async function getTotalDebtForUser(userId: any) {
    try {
      let totalDebt = 0;
      let totleExpense = 0;
      let totalCredit = 0;

      ;      // Define start and end dates for the current month
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


      // Iterate over each expense
      querySnapshot.forEach((doc) => {

        const expense = doc.data();
        const amount = expense.amount;
        const paidBy = expense.paidBy;

        // Calculate Mohammed's share in the expense
        const participants = expense.participants;
        const numParticipants = participants.length;
        const share = amount / numParticipants;

        // If Mohammed is the payer, he's owed by other participants
        // If Mohammed is not the payer, he owes the payer
        if (paidBy === userId) {
          totleExpense += amount;
          participants.forEach((participant: Participants) => {
            if (participant.Value !== userId && !participant.Payed) {
              totalCredit += share;
            }
            else if (participant.Value !== userId && participant.Payed) {
              totleExpense -= share;

            }
          });
        } else {
          participants.forEach((participant: Participants) => {
            if (participant.Value == userId && !participant.Payed) {
              totalDebt += share;
            } else if (participant.Value == userId && participant.Payed)
              totleExpense += share;

          });
          //console.log(doc.data())

          //totalDebt += share;
        }
      });
      var res = {
        "Expense": totleExpense.toFixed(2),
        "Credit": totalCredit.toFixed(2),
        "Debts": totalDebt.toFixed(2)
      }


      return res;
    } catch (error) {
      //console.error('Error calculating total debt:', error);
      throw error;
    }
  }

  useEffect(() => {

    // Define start and end dates for the current month
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
    )

    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {

        let totalDebt = 0;
        let totleExpense = 0;
        let totalCredit = 0;
        const todos: GetExpense[] = [];

        var value = await AsyncStorage.getItem('user');
        if (value == null)
          return;
        const Todos = snapshot.docs.forEach((doc) => {

          const expense = doc.data();
          const amount = expense.amount;
          const paidBy = expense.paidBy;

          // Calculate Mohammed's share in the expense
          const participants = expense.participants;
          const numParticipants = participants.length;
          const share = amount / numParticipants;

          // If Mohammed is the payer, he's owed by other participants
          // If Mohammed is not the payer, he owes the payer
          if (paidBy === value) {
            totleExpense += amount;
            participants.forEach((participant: Participants) => {
              if (participant.Value === value)
                todos.push({
                  id: doc.id,
                  ...expense
                } as GetExpense);

              if (participant.Value !== value && !participant.Payed) {
                totalCredit += share;
              }
              else if (participant.Value !== value && participant.Payed) {
                totleExpense -= share;

              }
            });
          } else {
            participants.forEach((participant: Participants) => {
              if (participant.Value == value && !participant.Payed) {
                totalDebt += share;
              } else if (participant.Value == value && participant.Payed) {
                totleExpense += share;
                todos.push({
                  id: doc.id,
                  ...expense
                } as GetExpense)
              }

            });
            //console.log(doc.data())

            //totalDebt += share;
          }


        });

        var res = {
          "Expense": totleExpense.toFixed(2),
          "Credit": totalCredit.toFixed(2),
          "Debts": totalDebt.toFixed(2)
        }
        //console.log("totale of Data",res)
        setGrouped(coupageGeneric(todos, 'cat'))
        //console.log(expGrouped);
        setCalculate(res);

      }
    })
    // Check if the user has already selected a user
    const checkUserSelection = async () => {
      try {
        const user = await str.getData('user', setSelectedUser);
        //alert(selectedUser)



      } catch (error) {
        // console.error('Error reading user selection:', error);
      }
    };

    checkUserSelection();
    return () => subscribe();


  }, []);
  const [modalVisible, setModalVisible] = useState(true);



  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (inputValue == '1') {



    return (
      <View >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
          style={{ width: "100%" }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Update {Updates.runtimeVersion}</Text>
              <Text ></Text>


              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                <TouchableOpacity
                  style={{ flexBasis: "45%", backgroundColor: "#3133", padding: 10, borderRadius: 15 }}
                  onPress={async () => {
                    try {
                      const update = await Updates.checkForUpdateAsync();
                      if (update.isAvailable) {

                        setInputValue(JSON.stringify(update));
                      }
                    } catch (err) {
                      console.error(err);
                      // Handle errors gracefully
                    }
                  }}>
                  <Text
                    style={{ textAlign: 'center' }}

                  >Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexBasis: "45%", backgroundColor: "#3133", padding: 10, borderRadius: 15 }}

                  onPress={handleCloseModal}>
                  <Text
                    style={{ textAlign: 'center' }}

                  >Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  }

  if (selectedUser == "") {
    return (
      <View style={{ paddingTop: StatusBar.currentHeight }}>
        <Text>Select Your profile Pls: </Text>
        <View style={styles.usersSelect}>
          {
            users.map((item) => {
              return <View key={item.Value}>
                <Button title={item.Value} onPress={() => {
                  str.storeData("user", item.Value, setSelectedUser);
                }} />

              </View>

            })
          }
        </View>



      </View>
    );
  }

  return (
    <SafeAreaView style={{ paddingTop: StatusBar.currentHeight }}>
      <ScrollView>
      <Text>{inputValue}</Text>
      </ScrollView>
      {isUpdateAvailable && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
          style={{ width: "100%" }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Update {Updates.runtimeVersion}</Text>
              <Text ></Text>


              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                <TouchableOpacity
                  style={{ flexBasis: "45%", backgroundColor: "#3133", padding: 10, borderRadius: 15 }}
                  onPress={async () => {
                    try {
                      const update = await Updates.checkForUpdateAsync();
                      if (update.isAvailable) {
                        //await Updates.fetchUpdateAsync();
              //await Updates.reloadAsync();
                        //setInputValue(JSON.stringify(update));
                        onFetchUpdateAsync();
                      }
                    } catch (err) {
                      console.error(err);
                      // Handle errors gracefully
                    }
                  }}>
                  <Text
                    style={{ textAlign: 'center' }}

                  >Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexBasis: "45%", backgroundColor: "#3133", padding: 10, borderRadius: 15 }}

                  onPress={handleCloseModal}>
                  <Text
                    style={{ textAlign: 'center' }}

                  >Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    

      <Dashboard
        CreditAmount={Calculate?.Credit}
        DebtAmount={Calculate?.Debts}
        ExpenseAmount={Calculate?.Expense}
      />
      <Text>Montly Expense By Grouped By Category: </Text>
      {
        expGrouped.length != 0 && (
          expGrouped.map(item => {
            return (
              <View key={item.date + "" + item.exp} style={{ flexDirection: "row", justifyContent: 'space-between', padding: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.date}</Text>

                <Text style={{ color: "red" }}>: -{item.exp} MAD</Text>
              </View>
            )
          })
        )
      }

    </SafeAreaView>
  )
}
/// eas update --branch production --message "change same config"
export default History

const styles = StyleSheet.create({

  openButton: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  usersSelect: {
    flexDirection: "row",
    justifyContent: 'space-between',
    gap: 10,
    top: 10,

  },
  container: {
    flex: 1,
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Distribute space between buttons
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
