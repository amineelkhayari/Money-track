//All dep Import
import { View, Text, TouchableOpacity, StyleSheet, FlatList, useColorScheme } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { ThemeColor } from '../Interfaces/Themed';
import { convertDate } from '../Interfaces/Method';

type pickerProps = {
  Data: any[],
  types: string,
  selectUser: string
};


const ListArray = (props: pickerProps) => {
  // Providers declare
  const colorScheme = useColorScheme();
  // State Declare
  // Delare evet effect
  // Method Declare
  const renderItem = ({ item }: { item: GroupedData }) => (
    <View style={styles.group}>
      <View style={{ alignItems: 'center', backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary }}>
        <Text style={[styles.date, { alignItems: 'baseline' }]}>

          {props.types != 'Expenses' ? item.date.toString() : convertDate(item.date.toString())}

        </Text>
        <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>

          {
            (props.types != 'Expenses' ? (
              <>
                Total Of {props.types} :  {item?.exp}
              </>
            ) :
              <>
                Exp: {item?.exp?.Expense} | Credit: {item?.exp?.Credit} | Debts: {item?.exp?.Debts}

              </>
            )

          }

        </Text>
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
              <Text style={{ fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary }}> + Payed By: {transaction.paidBy}</Text>

              <View style={[styles.transaction, { backgroundColor: transaction.paidBy === props.selectUser ? ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary : ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary }]}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>{transaction.description} type : {transaction.cat}</Text>
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
      <View style={styles.divider} />

    </View>
  );
  // Style declare
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
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
    }
  });

  if (props.Data.length == 0) {
    return <View style={{
      flex: 1,
      justifyContent: 'center', // Vertically center content
      alignItems: 'center',
    }}><Text>No {props.types}...</Text></View>;
  }
  return (
    <FlatList
      data={props.Data}
      keyExtractor={(group) => group.date}
      renderItem={renderItem}
    />
  )
}

export default ListArray



