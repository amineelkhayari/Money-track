import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View, Text, TextInput, FlatList, Button, Alert, KeyboardAvoidingView } from 'react-native';

import { Timestamp, addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { str } from '../Interfaces/Storage';
import { DropDownList } from '../Components/Picker';
import { category } from '../Interfaces/Cat';
import { users } from '../Interfaces/Users';
import Checkbox from '../Components/Checkbox';
import { db } from '../Interfaces/Firebase';
import Toast from '../Components/Toast';



export default function ModalScreen() {

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [Name, SetName] = useState<string>('');
  const [PayedBy, SetPayedBy] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [Price, SetPrice] = useState<string>("");


  //const [Price, SetPrice]: any = useState(0);
  const [Rechable, setRechable] = useState<boolean>(false); // Default to true to handle initial state
  const [done, setDone] = useState<boolean>(false); // Default to true to handle initial state

  const [isConnected, setIsConnected] = useState<boolean>(false); // Default to true to handle initial state
  const [items, setItems] = useState<Participants[]>(users);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const currentDate = new Date();
  const [exp, setexp] = useState<Expense>({
    amount: 0.0,
    description: '',
    paidBy: "",
    participants: [],
    cat: '',
    transaction: "",
    dateExp: currentDate.toLocaleDateString(),
    timeExp: currentDate.toLocaleTimeString(),
    sync: false,
    createdAt: currentDate


  });


  useEffect(() => {

    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsConnected(state.isConnected)
      setRechable(state.isInternetReachable)
      // console.log(state.isConnected)

    });

    loadExpenses();

    return () => {

      unsubscribe();
    };
  }, []);
  str.getData("user", setSelectedUser);


  //str.getData("user", setSelectedUser);


  const handleCheckboxChange = (id: number) => {
    const updatedItems = items.map(item =>
      item.ID === id ? { ...item, checked: !item.checked } : item
    );
    exp.participants = [];
    updatedItems.filter(chk => {
      if (chk.checked == true) exp.participants.push(chk)
    });

    //if(filterTrue.length>1)exp.participants.push(filterTrue);

    setItems(updatedItems);

  };
  const loadExpenses = async () => {
    try {
      //const savedExpenses = await AsyncStorage.getItem('LocalExpense');
      var value = await AsyncStorage.getItem('LocalExpense');

      if (value !== null) {
        setExpenses(JSON.parse(value));
        //console.log("Expense Saved On Local", value)
      }
    } catch (error) {
      //console.error("Error loading expenses from local storage:", error);
    }
  };
  const saveExpensesLocally = async () => {
    try {
      await AsyncStorage.setItem('LocalExpense', JSON.stringify(expenses));
      //Alert.alert("Data add Loccally");
      // console.log("Expenses saved locally:", expenses);
    } catch (error) {
      //console.error("Error saving expenses locally:", error);
    }
  };


  return (
    <View style={styles.container}>

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>

        <Text style={styles.label}>Description:</Text>


        <TextInput
          style={styles.textInput}
          value={Name}
          onChangeText={(Val) => SetName(Val)}
        />

        <Text style={styles.label}>Amount:</Text>
        <TextInput
          style={styles.textInput}
          autoFocus={true}
          value={Price}
          onChangeText={(val) => SetPrice(val)}
          keyboardType="numeric"
          placeholder='10'
        />
        <DropDownList
          Data={category}
          label="Category"
          styleLabel={styles.label}
          styletextInput={styles.textInput}
          selectedVal={selectedCat}
          onchange={(value) => setSelectedCat(value)}
          placerholder='Select Category'
        />

        <DropDownList
          Data={users}
          label="users"
          styleLabel={styles.label}
          styletextInput={styles.textInput}
          onchange={(value) => SetPayedBy(value)}
          selectedVal={PayedBy}
          placerholder='Select Payed By'
        />
        <Text style={styles.label}>Select Participants :</Text>

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
        <Toast message={exp.description + " is Added"} showToast={done} />

      </KeyboardAvoidingView>

      <Button title='Add New Expense' onPress={async () => {


        try {
          exp.transaction = selectedUser + "" + new Date().getTime();
          let num = Number(Price).toFixed(2);
          exp.amount = Number(num);
          exp.description = Name;
          exp.paidBy = PayedBy;
          exp.cat = selectedCat
          // Check if all keys have data
          if (!exp.description) {
            Alert.alert('Error', 'Description is required.');
            return;
          }

          if (!exp.amount) {
            //await str.removeValue('LocalExpense')

            Alert.alert('Error', 'Amount Is Required.');
            return;
          }

          if (!exp.dateExp) {
            Alert.alert('Error', 'Date Of Expense Is Required.');
            return;
          }

          if (!exp.paidBy) {
            Alert.alert('Error', 'Paid By Is Required.');
            return;
          }
          if (exp.participants.length === 0) {
            Alert.alert('Error', 'Participant Is Required.');
            return;
          }
          if (selectedCat === "") {
            Alert.alert('Error', 'Category Is Required.');
            return;
          }


          //await setDoc(doc(db, 'users', selectedUser + new Date().getTime()), exp);

          if (isConnected && Rechable) {
            exp.sync = !exp.sync;
            await setDoc(doc(db, 'users', exp.transaction), exp);
            Alert.alert('Data Add On Server.', 'With Success');
            //setDone(true);

          } else {
            // Add expense locally
            //setExpenses([...expenses, exp]);
            expenses.push(exp)
            setDoc(doc(db, 'users', exp.transaction), exp);
            //console.log(exp)
            //console.log("Expenses ",expenses)
            await saveExpensesLocally();
            Alert.alert('Data Add On Local.', 'With Success');
          }

          SetName('');
          setSelectedCat('');
          SetPayedBy('');
          SetPrice('');
          setDone(false);

          setItems(users);
          let currentDate = new Date();
          setexp({
            amount: 0.0,
            description: '',
            paidBy: "",
            participants: [],
            transaction: "",
            cat: '',
            dateExp: currentDate.toLocaleDateString(),
            timeExp: currentDate.toLocaleTimeString(),
            sync: false,
            createdAt: currentDate

          });
          //console.log('New data added successfully', expenses);

        } catch (error) {
          //  console.error('Error adding new data:', error);
        }

        //console.log(expenses)

        //newDocumentData.participants.push();

      }} />
      {/* <Button onPress={async () => {
        // Assuming you have a reference to your Firestore collection
        const collectionRef = collection(db, 'users');

        // Fetch documents from the collection
        getDocs(collectionRef)
          .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
              try {
                const data = doc.data();
                // Check if the document already has a createdAt field
                if (!data.createdAt) {
                  // Combine dateExp and timeExp into a JavaScript Date object
                  const dateParts = data.dateExp.split('/');
                  const timeParts = data.timeExp.split(':');
                  const combinedDateTime = new Date(
                    parseInt(dateParts[2]), // year
                    parseInt(dateParts[0]) - 1, // month (0-indexed)
                    parseInt(dateParts[1]), // day
                    parseInt(timeParts[0]), // hours
                    parseInt(timeParts[1]), // minutes
                    parseInt(timeParts[2]) // seconds
                  );

                  // Convert combinedDateTime to a Firestore Timestamp object
                  const createdAt = Timestamp.fromDate(combinedDateTime);

                  // Update the document with the new createdAt field
                  await updateDoc(doc.ref, { createdAt });
                  console.log("Document updated with createdAt field:", doc.id);
                } else {
                  console.log("Document already has createdAt field:", doc.id);
                }
              } catch (error) {
                console.error("Error updating document:", error);
              }
            });
          })
          .catch((error) => {
            console.error("Error getting documents: ", error);
          });

        // await setDoc(doc(db, 'tester',""+new Date().getTime() ), {
        //   createAt:serverTimestamp(),
        //   createpm:new Date(),

        // });

      }} title='Test' /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: 10,
  },
  textInput: {
    height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10
  },
  container: {
    flex: 1,
    padding: 15
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
