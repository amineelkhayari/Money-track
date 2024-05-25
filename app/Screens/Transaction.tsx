// All dep Import
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Button, Modal, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../Interfaces/Firebase';
import { monthNames, users } from '../Interfaces/Users';
import Dashboard from '../Components/Dashboard';
import { convertDate, coupageGeneric } from '../Interfaces/Method';
import * as Updates from 'expo-updates';
import { DropDownList } from '../Components/Picker';
import { ThemeColor } from '../Interfaces/Themed';
import { useColorScheme } from 'react-native';
import { useUsername } from '../Components/userName';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Interfaces/userSlice';

const History = () => {
  // Providers declare
  const colorScheme = useColorScheme();
  const { setSelectedMonth, selectedMonth, startOfm, endOfm } = useUsername();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const {
    currentlyRunning,
    availableUpdate,
    isUpdateAvailable,
    isUpdatePending
  } = Updates.useUpdates();

  //State Declare
  const [DataCount, setDataCount] = useState<number>(0);
  const [Calculate, setCalculate] = useState<any>();
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);

  

  // delare evet effect
  useEffect(() => {
    //console.log("all data",expenses);
    // Define start and end dates for the current month
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection,
      where('createdAt', '>=', startOfm),
      where('createdAt', '<', endOfm),
      orderBy('createdAt', 'desc')
    )
    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {
        let totalDebt = 0;
        let totleExpense = 0;
        let totalCredit = 0;
        const todos: GetExpense[] = [];
        if (user == null || user == '' || user == undefined)
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
          if (paidBy === user) {
            totleExpense += amount;
            participants.forEach((participant: Participants) => {
              if (participant.Value === user)
                todos.push({
                  id: doc.id,
                  ...expense
                } as GetExpense);

              if (participant.Value !== user && !participant.Payed) {
                totalCredit += share;
              }
              else if (participant.Value !== user && participant.Payed) {
                totleExpense -= share;
              }
            });
          } else {
            participants.forEach((participant: Participants) => {
              if (participant.Value == user && !participant.Payed) {
                totalDebt += share;
              } else if (participant.Value == user && participant.Payed) {
                totleExpense += share;
                todos.push({
                  id: doc.id,
                  ...expense
                } as GetExpense)
              }

            });
          }
        });
        console.log(" in  function ");
        var res = {
          "Expense": totleExpense.toFixed(2),
          "Credit": totalCredit.toFixed(2),
          "Debts": totalDebt.toFixed(2)
        }
        setGrouped(coupageGeneric(todos, 'cat'))
        setCalculate(res);
        setDataCount(todos.length);
      }
    })
    return () => subscribe();
  }, [selectedMonth, user]);
  const [modalVisible, setModalVisible] = useState(true);

  //Method Declare
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

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  //styles Declare
  const styles = StyleSheet.create({

    openButton: {
      fontSize: 16,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
      textDecorationLine: 'underline',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
    },
    modalContent: {
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '90%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingLeft: 10,
    },
    closeButton: {
      marginTop: 10,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
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
    cardwrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 30,
      marginHorizontal: 10,
    },

    card: {
      width: '45%',
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
      marginVertical: 10,
      paddingVertical: 20,
      alignItems: 'center',
    },
  });

  if (!user) {
    return (
      <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background }}>
        <Text style={styles.modalTitle}>Select Your profile Pls: </Text>
        <View style={styles.cardwrap}>
          {
            users.map((item) => {
              return <View style={styles.card} key={item.Value}>

                <TouchableOpacity onPress={() => {
                  //setUsername(item.Value);
                  dispatch(setUser(item.Value));
                }} >
                  <Text style={styles.modalTitle}>{item.Value}</Text>

                </TouchableOpacity>
              </View>

            })
          }

        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ paddingTop: StatusBar.currentHeight, backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background, flex: 1 }}>
      <StatusBar backgroundColor={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background} />
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
              <Text style={styles.modalTitle}>New Update {Updates.createdAt?.toDateString()}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                <TouchableOpacity
                  style={{ flexBasis: "45%", backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary, padding: 10, borderRadius: 15 }}
                  onPress={async () => {
                    try {
                      if (isUpdateAvailable) {
                        onFetchUpdateAsync();
                      }
                    } catch (err) {
                      console.error(err);
                      // Handle errors gracefully
                    }
                  }}>
                  <Text
                    style={[styles.modalTitle, { textAlign: 'center' }]}

                  >Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexBasis: "45%", backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary, padding: 10, borderRadius: 15 }}

                  onPress={handleCloseModal}>
                  <Text
                    style={[styles.modalTitle, { textAlign: 'center' }]}

                  >Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <View>
        <Text style={{ fontWeight: 'bold', padding: 10, textAlign: 'center', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }} >
          Welcome Mrs: {user}</Text>
        <DropDownList
          Data={monthNames}
          label={"Month"}
          styleLabel={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}
          styletextInput={{

            color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,

          }}
          onchange={(value) => {
            var val = parseInt(value, 10);
            setSelectedMonth(val)
          }}
          selectedVal={selectedMonth.toString()}
          placerholder={'Select Month'}
        />
      </View>
      <Dashboard
        CreditAmount={Calculate?.Credit}
        DebtAmount={Calculate?.Debts}
        ExpenseAmount={Calculate?.Expense}
        totalCount={DataCount}
        endDate={endOfm}
        startDate={startOfm}
      />
      <Text style={{
        fontWeight: "800",
        textAlign: 'center',
        color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary
      }}>Montly Expense By Category : </Text>
      {
        expGrouped.length != 0 && (
          expGrouped.map(item => {
            return (
              <View key={item.date + "" + item.exp} style={{ flexDirection: "row", justifyContent: 'space-between', padding: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>{item.date}</Text>

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