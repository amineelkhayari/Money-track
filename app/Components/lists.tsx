import { View, Text, TouchableOpacity, StyleSheet, FlatList, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { ThemeColor } from '../Interfaces/Themed';
import { convertDate } from '../Interfaces/Method';
import { Ionicons, Fontisto } from '@expo/vector-icons';
import { deleteExpense } from '../Interfaces/expenseSlice';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Interfaces/Firebase';
import { useDispatch } from 'react-redux';

type pickerProps = {
  Data: any[],
  types: string,
  selectUser: string
};

const ListArray = (props: pickerProps) => {
  const colorScheme = useColorScheme();
  const [selectTransaction, setSelectTransaction] = useState<string[]>([]);
  const dispatch = useDispatch();
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (date: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const handleLongPress = (transactionId: string) => {
    setSelectTransaction(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  const renderItem = ({ item }: { item: GroupedData }) => (
    <View style={styles.group}>
      <TouchableOpacity onPress={() => toggleGroup(item.date)} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.date, { alignItems: 'baseline' }]}>
          {props.types != 'Expenses' ? item.date.toString() : convertDate(item.date.toString())} ({item.data.length}) : {props.types == 'Expenses' ? item?.exp?.Expense: item?.exp}
        </Text>
        
        
        <Ionicons name={expandedGroups[item.date] ? 'chevron-up' : 'chevron-down'} size={24} color={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary} />
      </TouchableOpacity>
      {expandedGroups[item.date] && (
        <View>
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
                  onLongPress={() => handleLongPress(transaction.transaction)}
                  key={transaction.transaction}
                  onPress={() => {
                    router.push({
                      pathname: 'Screens/Detail', params: { id: transaction.transaction }
                    });
                  }}>

                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    //backgroundColor: selectTransaction.includes(transaction.transaction) ? 'green' : 'red'
                  }}>
                    {
                      selectTransaction.includes(transaction.transaction) && (
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

  // Rest of your component...


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
      {selectTransaction.length > 0 && (
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
              }
            }}
          >
            <Ionicons name="trash-bin-sharp" size={22} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'black', padding: 10, borderRadius: 10

            }}
            onPress={() => {
              setSelectTransaction([]);

            }}
          >
            <Ionicons name="restaurant-outline" size={22} color={'white'} />


          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default ListArray;
