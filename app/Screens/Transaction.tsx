// All dep Import
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Button, Modal, TouchableOpacity, Alert, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../Interfaces/Firebase';
import { monthNames, users } from '../Interfaces/Users';
import Dashboard from '../Components/Dashboard';
import { coupageGeneric } from '../Interfaces/Method';
import * as Updates from 'expo-updates';
import { DropDownList } from '../Components/Picker';
import { ThemeColor } from '../Interfaces/Themed';
import { useColorScheme } from 'react-native';
import { useUsername } from '../Components/userName';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Interfaces/userSlice';
import { setDark, setFilterBy } from '../reducer/paramsSlice';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
const History = () => {
  // Providers declare
  const colorScheme = useColorScheme();
  const { setSelectedMonth, selectedMonth, startOfm, endOfm } = useUsername();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const params = useSelector((state: any) => state.params);
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
  const [modalVisible, setModalVisible] = useState(true);
  const [paramsVisible, setParamsVisible] = useState(false);

  const toggleModal = () => {
    setParamsVisible(!paramsVisible);
  };

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
    setModalVisible(!paramsVisible);
  };

  //styles Declare
  const styles = StyleSheet.create({
    topBar: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingHorizontal: 10,
      right: 15,
    },
    iconButton: {
      padding: 10,
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,

    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    openButton: {
      fontSize: 16,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
      textDecorationLine: 'underline',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 200
      //backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
    },
    modalContent: {
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
      padding: 10
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
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
      borderRadius: 10,
      padding: 10,

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

    textStyle: {
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      height: '90%'
    },
    modalView: {
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 35,
      shadowColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 15,
      width: '100%',
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isUpdateAvailable}
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


      <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', padding: 10, color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }} >
          Welcome Mrs: {user}</Text>
        <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
          <FontAwesome6 name="filter-circle-dollar" size={24} color={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text} />
        </TouchableOpacity>
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

                <Text style={{ color: "red" }}>: 100 - {item.exp} = {(100 - item.exp).toFixed(2)}  MAD</Text>
              </View>
            )
          })
        )
      }
      {/* <Button title='load' onPress={() => {
       // dispatch(setFilterBy("dateExp"));
        console.log(params.filterBy);
        //setParamsVisible(!paramsVisible)
      }} /> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paramsVisible}
        onRequestClose={toggleModal}
      >
        <View style={[styles.overlay]} >
          <View style={[styles.modalView, {
            height: "80%",
            width: '100%',
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary
          }]}>

            <DropDownList
              Data={monthNames}
              label={"Month"}
              styleLabel={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}
              styletextInput={{
                width: '100%',
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
            <DropDownList
              Data={[{ ID: 1, Value: "dateExp" }, { ID: 2, Value: "cat" }, { ID: 3, Value: "paidBy" }]}
              label={"Filter By"}
              styleLabel={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}
              styletextInput={{
                width: '100%',
                color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
                backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
              }}
              onchange={(value) => {
                dispatch(setFilterBy(value))
              }}
              selectedVal={params.filterBy}
              placerholder={'Select Filter By'}
            />
            <Switch
              trackColor={{ false: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary, true: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary }}
              thumbColor={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary}
              ios_backgroundColor={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary}
              onValueChange={() => {
                dispatch(setDark(!params.dark));
              }}
              value={params.dark}
            />
            <Text style={styles.modalText}>Hello, I am a bottom modal!</Text>
            <View style={[styles.buttonContainer, {
              width: '100%',
              alignSelf: 'center',

            }]}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal}
              >
                <Ionicons name="close-circle" size={24} color={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}
/// eas update --branch production --message "change same config"
export default History