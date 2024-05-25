import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, useColorScheme } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { str } from '../Interfaces/Storage';
import { DropDownList } from '../Components/Picker';
import { category } from '../Interfaces/Cat';
import { users } from '../Interfaces/Users';
import Checkbox from '../Components/Checkbox';
import { db } from '../Interfaces/Firebase';
import Toast from '../Components/Toast';
import { ThemeColor } from '../Interfaces/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, resetExpenses } from '../Interfaces/expenseSlice';

const currentDate = new Date();

const initialExpense = {
  amount: 0,
  description: '',
  paidBy: "",
  participants: [],
  cat: '',
  transaction: "",
  dateExp: currentDate.toLocaleDateString(),
  timeExp: currentDate.toLocaleTimeString(),
  sync: false,
  createdAt: currentDate
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: 10,
  },
  textInput: {
    height: 40, borderWidth: 1, marginBottom: 20, padding: 10,
  },
  container: {
    flex: 1,
    padding: 15,
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
  button: {
    height: 50,
    borderWidth: 2,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  buttonText: {
    fontWeight: 'bold',
    letterSpacing: 3,
    fontSize: 18,
  }
});

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const [Name, SetName] = useState<string>('');
  const [PayedBy, SetPayedBy] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [Price, SetPrice] = useState<string>("");
  const [done, setDone] = useState<boolean>(false); // Default to true to handle initial state
  const [items, setItems] = useState<Participants[]>(users);
  const [exp, setExp] = useState<Expense>(initialExpense);
  const [message, setMessage] = useState<string>('');

 

  const handleCheckboxChange = useCallback((id: number) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.ID === id ? { ...item, checked: !item.checked } : item
      );
      const selectedParticipants = updatedItems.filter(item => item.checked);
      setExp(prevExp => ({ ...prevExp, participants: selectedParticipants }));
      return updatedItems;
    });
  }, []);

  const handleAddExpense = async () => {
    try {
      const transactionId = user + "" + new Date().getTime();
      const amount = Number(Number(Price).toFixed(2));

      if (!Name || !amount || !exp.dateExp || !PayedBy || exp.participants.length === 0 || !selectedCat) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }

      const newExpense = {
        ...exp,
        transaction: transactionId,
        amount,
        description: Name,
        paidBy: PayedBy,
        cat: selectedCat,
      };

      const state = await NetInfo.fetch();
      if (state.isConnected && state.isInternetReachable) {
        newExpense.sync = true;
        await setDoc(doc(db, 'users', newExpense.transaction), newExpense);
        //setMessage("New Xpenses "+exp.description+" : "+exp.amount+" Mad ");

        Alert.alert('Data Added On Server', 'With Success');
      } else {
        setDoc(doc(db, 'users', newExpense.transaction), newExpense);

        Alert.alert('Data Added Locally', 'With Success');
      }

      dispatch(addExpense(newExpense));

      // Reset form
      SetName('');
      SetPrice('');
      SetPayedBy('');
      setSelectedCat('');
      setItems(users);
      setExp(initialExpense);
      setDone(true);
    } catch (error) {
      console.error('Error adding new data:', error);
    }
  };

  const themeStyles = useMemo(() => ({
    label: {
      ...styles.label,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
    },
    textInput: {
      ...styles.textInput,
      borderColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
    },
    container: {
      ...styles.container,
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
    },
    button: {
      ...styles.button,
      borderColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
    },
    buttonText: {
      ...styles.buttonText,
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
    },
  }), [colorScheme]);

  return (
    <View style={themeStyles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Text style={themeStyles.label}>Description:</Text>
        <TextInput
          style={themeStyles.textInput}
          value={Name}
          onChangeText={SetName}
        />

        <Text style={themeStyles.label}>Amount:</Text>
        <TextInput
          style={themeStyles.textInput}
          value={Price}
          onChangeText={SetPrice}
          keyboardType="numeric"
          placeholder="10"
        />

        <DropDownList
          Data={category}
          label="Category"
          styleLabel={themeStyles.label}
          styletextInput={themeStyles.textInput}
          selectedVal={selectedCat}
          onchange={setSelectedCat}
          placerholder="Select Category"
        />

        <DropDownList
          Data={users}
          label="Paid By"
          styleLabel={themeStyles.label}
          styletextInput={themeStyles.textInput}
          selectedVal={PayedBy}
          onchange={SetPayedBy}
          placerholder="Select Paid By"
        />

        <Text style={themeStyles.label}>Select Participants:</Text>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <Checkbox
              label={item.Value}
              checked={item.checked}
              onChange={() => handleCheckboxChange(item.ID)}
            />
          )}
          keyExtractor={item => item.ID.toString()}
        />
        <Toast message={message} showToast={done} />
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={themeStyles.button}
        onPress={handleAddExpense}
      >
        <Text style={themeStyles.buttonText}>Add New Expense</Text>
      </TouchableOpacity>
    </View>
  );
}
