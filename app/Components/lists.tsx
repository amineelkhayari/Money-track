import { View, Text, TouchableOpacity, StyleSheet, FlatList, useColorScheme, Alert, Button } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { ThemeColor } from '../Interfaces/Themed';
import { convertDate, coupageGeneric } from '../Interfaces/Method';
import { Ionicons, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { deleteExpense, updateExpense } from '../Interfaces/expenseSlice';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Interfaces/Firebase';
import { useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Expenses from '../Screens/Expense';

type pickerProps = {
  Data: any[],
  types: string,
  selectUser: string,
};

const ListArray = (props: pickerProps) => {
  const colorScheme = useColorScheme();
  const [selectTransaction, setSelectTransaction] = useState<string[]>([]);
  const dispatch = useDispatch();
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [listTrWithUser, setListTrWithUser] = useState<{ [key: string]: Expense[] }>({});

  const [overData, setOverData] = useState<any[]>([]);

  const toggleGroup = (date: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };
  const listData = (user: string, transaction: string) => {

    setListTrWithUser((prevState: any) => {
      const userTransactions = prevState[user] || [];
      if (userTransactions.filter((e: Expense) => e.transaction === transaction).length) {
        const updatedUserTransactions = [...userTransactions, transaction];
        return { ...prevState, [user]: updatedUserTransactions };
      } else {
        let index: number = userTransactions.findIndex((index: Expense) => index.transaction === transaction)
        userTransactions.splice(index, 1);
        return { ...prevState, [user]: userTransactions }

      }
      // return prevState; // No changes if the transaction already exists
    });
    // listTrWithUser[user].push(transaction);
    console.log("user transaction: ", listTrWithUser);

  }

  const handleLongPress = (transactionId: string, userInter?: string) => {
    if (userInter) listData(userInter, transactionId);
    console.log('userInetr', userInter)
    setSelectTransaction(prev => {
      if (prev.includes(transactionId)) {
        console.log(transactionId);
        return prev.filter(id => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  const renderItem = ({ item }: { item: GroupedData }) => (
    <View style={styles.group}>
      <TouchableOpacity onPress={() => toggleGroup(item.date)} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.date, { alignItems: 'center' }]}>
          {props.types != 'Expenses' ? item.date.toString() : convertDate(item.date.toString())} ({item.data.length}) : {props.types == 'Expenses' ? item?.exp?.Expense : item?.exp}
        </Text>
        {
          (props.types != 'Expenses') && (
            <>




              <TouchableOpacity
                style={{
                  backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
                  paddingLeft: 10, paddingRight: 10
                }}

                onPress={async () => {

                  Alert.alert(
                    "Are your sure?",
                    "To Pay All " + props.types + " For User : " + item.date,
                    [
                      // The "Yes" button
                      {
                        text: "Yes",
                        onPress: async () => {
                          const state = await NetInfo.fetch();
                          let sync = false;
                          item.data.forEach(async it => {
                            let documentRef = doc(db, 'users', it.transaction);
                            it.participants.forEach(participant => {
                              if (participant.Value === item.date)
                                participant.Payed = true;
                              else if (participant.Value === props.selectUser)
                                participant.Payed = true;
                            })
                            const mapped: Expense = {
                              amount: it.amount,
                              cat: it.cat,
                              createdAt: it.createdAt,
                              dateExp: it.dateExp,
                              timeExp: it.timeExp,
                              description: it.description,
                              paidBy: it.paidBy,
                              participants: it.participants,
                              sync: it.sync,
                              transaction: it.transaction
                            }

                            if (state.isConnected && state.isInternetReachable) {
                              sync = true;
                              await updateDoc(documentRef, mapped)
                            } else {
                              updateDoc(documentRef, { ...mapped, sync });
                            }

                            dispatch(updateExpense({ ...mapped, sync }))
                            console.log(props.selectUser, mapped);
                          })
                        },
                      },
                      // The "No" button
                      // Does nothing but dismiss the dialog when tapped
                      {
                        text: "No",
                        onPress: () => {
                        }
                      },
                    ]
                  );
                }}>
                <Text style={[styles.date, { alignItems: 'center' }]}>
                  Pay
                </Text>
              </TouchableOpacity></>
          )
        }
        <Ionicons name={expandedGroups[item.date] ? 'chevron-up' : 'chevron-down'} size={24} color={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary} />
      </TouchableOpacity>

      {expandedGroups[item.date] && (
        <View>
          {
            props.types != 'Expenses' && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setOverData(coupageGeneric(item.data, "dateExp"));
                    }}
                    style={{ flexBasis: '45%', backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary  }}>
                    <Text style={{textAlign:'center',padding:5}}>open</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      var data = coupageGeneric(item.data, "cat");
                    }}
                    style={{ flexBasis: '45%', backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text  }}>
                    <Text style={{textAlign:'center',padding:5}}>Send</Text>
                  </TouchableOpacity>



                </View>
                <ListArray Data={overData} selectUser={props.selectUser} types={props.types} />

              </>
            )
          }
          <View style={{ alignItems: 'center', backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary }}>
            <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>
              {props.types != 'Expenses' ? (
                <>Total Of {props.types} :  {item?.exp}</>
              ) : (
                <>Exp: {item?.exp?.Expense} | Credit: {item?.exp?.Credit} | Debts: {item?.exp?.Debts}</>
              )}
            </Text>
          </View>
          <FlatList
            data={item.data}
            keyExtractor={(transaction) => transaction.transaction}
            renderItem={({ item: transaction }) => (
              <>
                <TouchableOpacity
                  onLongPress={() => handleLongPress(transaction.transaction, item.date)}
                  key={transaction.transaction}
                  onPress={() => {
                    router.push({
                      pathname: 'Screens/Detail', params: { id: transaction.transaction }
                    });
                  }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                    {
                      listTrWithUser[item.date]?.filter(e => e.transaction == transaction.transaction).length > 0
                      && (
                        <Fontisto name={'checkbox-active'} size={24} color={selectTransaction.includes(transaction.transaction) ? ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary : ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary} />
                      )
                    }

                    <Text style={{ fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary }}>
                      + Payed By: {transaction.paidBy}
                    </Text>
                    <Text style={{ fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary }}>
                      + At: {transaction.dateExp}
                    </Text>
                  </View>
                  <View style={[styles.transaction, { backgroundColor: transaction.paidBy === props.selectUser ? ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary : ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary }]}>
                    <View>
                      <Text style={{ fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>{transaction.description} type: {transaction.cat}</Text>
                      <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>At: {transaction.timeExp}</Text>
                    </View>
                    <View>
                      <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>Parts: {transaction.participants.length}</Text>
                      <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>Amount: {(transaction.amount / transaction.participants.length).toFixed(2)}/ {transaction.amount}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.div} />
              </>
            )}
          />
        </View>
      )}
      <View style={styles.divider} />
    </View>
  );

  const styles = StyleSheet.create({
    div: {
      height: 1,
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
      marginVertical: 10,
    },
    divider: {
      height: 3,
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
      marginVertical: 10,
    },
    container: {
      flex: 1,
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
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
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
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
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
    }
  });

  if (props.Data.length == 0) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>No {props.types}...</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={props.Data}
        keyExtractor={(group) => group.date}
        renderItem={renderItem}
      />
      {(Object.keys(listTrWithUser).length > 0 && Object.values(listTrWithUser).some(arr => arr.length > 0)) && (
        <View style={{
          position: 'absolute',
          top: 5,
          right: 5,
          padding: 10,
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red', padding: 10, borderRadius: 10

            }}
            onPress={() => {
              if (selectTransaction.length > 0) {
                selectTransaction.map(async (item) => {
                  dispatch(deleteExpense(item));
                  await deleteDoc(doc(db, "users", item));
                });
                setSelectTransaction([]);
                setListTrWithUser({});
              }
            }}
          >
            <Ionicons name="trash-bin-sharp" size={22} color={'white'} />
          </TouchableOpacity>
          {
            (props.types != 'Expenses') &&
            (
              <TouchableOpacity
                style={{
                  backgroundColor: 'green', padding: 10, borderRadius: 10

                }}
                onPress={() => {
                  //pay difrent user
                  console.log(props.Data, "user list")

                  Object.entries(listTrWithUser).forEach(([key, value]) => {
                    console.log(`${key}: ${value}`);
                  });


                }}
              >
                <MaterialIcons name="payment" size={22} color={'white'} />


              </TouchableOpacity>
            )
          }

          <TouchableOpacity
            style={{
              backgroundColor: 'black', padding: 10, borderRadius: 10

            }}
            onPress={() => {
              setSelectTransaction([]);
              setListTrWithUser({});

            }}
          >
            <MaterialIcons name="clear" size={22} color={'white'} />


          </TouchableOpacity>

        </View>
      )}
    </View>
  );
}

export default ListArray;
