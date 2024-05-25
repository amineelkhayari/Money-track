//All dep Import
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

type DashProps = {
  ExpenseAmount: number, CreditAmount: number, DebtAmount: number, totalCount?: number
  startDate: Date, endDate: Date
};

const Dashboard = (props: DashProps) => {
  // Providers declare
  const { ExpenseAmount, CreditAmount, DebtAmount
  } = props;

  // State Declare
  // Delare evet effect
  // Method Declare
  // Style declare
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 10,
    },

    card: {
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#535F93',
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      marginVertical: 20,
    },
    cardTop: {
      // backgroundColor: 'blue',
      marginBottom: 20,
    },
    cardBottom: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      margin: 'auto',
      backgroundColor: '#E0D1EA',
      borderRadius: 5,
    },
    cardBottomSame: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });
  return (
    <View>
      <View style={styles.card}>
        <View style={[styles.cardBottom, {
          flexDirection: 'column'
        }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>From</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{props.startDate.toDateString()}</Text>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>To</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{props.endDate.toDateString()}</Text>

          </View>
        </View>
        <View style={styles.cardTop}>

          <Text style={{ textAlign: 'center', color: 'aliceblue', flexDirection: "row", justifyContent: "space-between" }}>
            Total Expense {props.totalCount !== undefined && (
              <>
                ({props.totalCount})
              </>
            )}

          </Text>
          <Text style={{ fontSize: 20, textAlign: 'center', color: 'aliceblue' }}>
            $ {ExpenseAmount}
          </Text>
        </View>
        <View style={styles.cardBottom}>
          <View>
            <View style={styles.cardBottomSame}>
              <Feather name='arrow-down' size={18} color='green' />
              <Text
                style={{
                  textAlign: 'center',
                  marginLeft: 5,
                }}
              >
                Credits
              </Text>
            </View>
            <Text style={{ textAlign: 'center' }}>
              $ {CreditAmount}
            </Text>
          </View>
          <View>
            <View style={styles.cardBottomSame}>
              <Feather name='arrow-up' size={18} color='red' />
              <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                Debts
              </Text>
            </View>
            <Text style={{ textAlign: 'center' }}>
              $ {DebtAmount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Dashboard
