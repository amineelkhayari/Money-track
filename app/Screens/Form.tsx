import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, useColorScheme, useWindowDimensions, StatusBar, Modal, Button, TouchableWithoutFeedback } from 'react-native';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DropDownList } from '../Components/Picker';
import { category } from '../Interfaces/Cat';
import { users } from '../Interfaces/Users';
import Checkbox from '../Components/Checkbox';
import { db } from '../Interfaces/Firebase';
import Toast from '../Components/Toast';
import { ThemeColor } from '../Interfaces/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, resetExpenses } from '../Interfaces/expenseSlice';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Ionicons } from '@expo/vector-icons';
import { addCashFlow, clearBanks, deleteRecord, updateBank } from '../reducer/banksSlice';
import { useUsername } from '../Components/userName';
import { convertDate, coupageGeneric } from '../Interfaces/Method';

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
const initialBank: Bank = {
  amount: 0,
  motif: null,
  cat: 'Withdraw',
  transaction: null,
  dateExp: currentDate.toLocaleDateString(),
  timeExp: currentDate.toLocaleTimeString(),
  sync: false,
  createdAt: currentDate,
  user: null
};
const styles = StyleSheet.create({

  buttonTextx: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center'
  },
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
    //padding: 15,
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

export default function FormAdd() {
  // Providers declare
  const layout = useWindowDimensions();
  const colorScheme = useColorScheme();

  //State Declare
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'expense', title: 'expense' },
    { key: 'bank', title: 'bank' }
  ]);
  //Method Declare
  const renderScene = SceneMap({
    expense: ModalScreen,
    bank: BankScreen,
  });
  const getTabBarIcon = (props: any) => {
    const { route, focused } = props
    const active = ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary;
    const inActive = "#fff";
    if (route.key === 'expense') {
      return <MaterialIcons name="payment" size={30} color={focused ? active : inActive} />
    }
    if (route.key === 'bank') {
      return <MaterialCommunityIcons name="bank-transfer" size={30} color={focused ? active : inActive} />
    }

  }


  //styles Declare
  const styles = StyleSheet.create({
    scene: {
      flex: 1,
    },
    noLabel: {
      display: 'none',
      height: 1,
    },
    image: {
      width: 40,
      height: 30,
      resizeMode: 'contain', // You can adjust resizeMode based on your requirements

    },
    tabBar: {
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary, // Change background color as desired
    },
  })


  return (
    <TabView

      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props =>
        <TabBar
          indicatorStyle={{ borderBottomColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary, borderBottomWidth: 2 }} // Customize the border color and width
          {...props}
          renderIcon={
            props => getTabBarIcon(props)
          }
          labelStyle={styles.noLabel}
          style={styles.tabBar}
        />
      }
      tabBarPosition={'top'}
    />
  );
}

function BankScreen() {
  const colorScheme = useColorScheme();
  const colors = ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'];
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const { username, selectedMonth, endOfm, startOfm } = useUsername();
  const banks = useSelector((state: any) => state.banks.Bank);
  const params = useSelector((state: any) => state.params);

  //states
  const [formad, setFormAdd] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [bankExp, setBankExp] = useState<Bank>({ ...initialBank, user });
  const [expsBank, setExpenses] = useState<Bank[]>([]);
  const [diff, setDiff] = useState<any>({
    "withdraw": "0",
    "deposit": "0",
    "balance": "0"
  });
  const [expGrouped, setGrouped] = useState<groupeBank[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log("balnce", diff)
    const usersCollection = collection(db, 'bank');
    let withdrawAmount = 0;
    let depositAmount = 0;
    const q = query(usersCollection,
      where('createdAt', '>=', startOfm),
      where('createdAt', '<', endOfm),
      where('user', '==', user),
      orderBy('createdAt', 'desc')
    )

    setExpenses([]);

    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {
        const newExpsBank: Bank[] = [];


        snapshot.docs.forEach((doc) => {
          const data: Bank = doc.data() as Bank;
          if (data.cat === "Withdraw") withdrawAmount += data.amount;

          if (data.cat === "Deposit") depositAmount += data.amount;

          newExpsBank.push(data);
        });

        setExpenses(newExpsBank);
        setGrouped(coupageGeneric(newExpsBank, "cat"));

        var res = {
          "withdraw": withdrawAmount.toFixed(2),
          "deposit": depositAmount.toFixed(2),
          "balance": (depositAmount - withdrawAmount).toFixed(2)
        }
        setDiff(res);
        depositAmount = 0;
        withdrawAmount = 0;
      }
    })
    return () => subscribe();

  }, [selectedMonth, params, user])

  const styless = StyleSheet.create({
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
    closeButton: {
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
      borderRadius: 10,
      padding: 10,
    },

  })
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
  // methods
  const handleBank = () => {
    setFormAdd(!formad);
  }
  const toggleGroup = (date: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };
  return (
    <View style={[styles.container, {
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
    }]}>
      <Text style={[themeStyles.label, {
        color: "green"
      }]}>
        Total Deposit     : + {diff?.deposit} MAD
      </Text>
      <Text style={[themeStyles.label, {
        color: "red"
      }]}>
        Total Withdraw    : - {diff?.withdraw} MAD
      </Text>
      <Text style={[themeStyles.label, {
        color: parseFloat(diff?.balance) >= 0 ? "green" : "red"
      }]}>
        Total Balance     : {diff?.balance} MAD
      </Text>
      <FlatList
        data={expGrouped}
        keyExtractor={(group) => group.date}
        renderItem={
          ({ item }: { item: groupeBank }) => (
            <View style={{
              marginBottom: 20,
              paddingHorizontal: 20,
            }}>
              <TouchableOpacity onPress={() => toggleGroup(item.date)} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{
                  alignItems: 'baseline', fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
                }}>
                  {item.date.toString()} ({item.data.length}) : {item?.exp}
                </Text>
                <Ionicons name={expandedGroups[item.date] ? 'chevron-up' : 'chevron-down'} size={24} color={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary} />
              </TouchableOpacity>
              {expandedGroups[item.date] && (
                <View style={{ alignItems: 'center' }}>


                  <FlatList
                    data={item.data}
                    keyExtractor={(transaction) => transaction.amount + "" + transaction.transaction}
                    renderItem={({ item }: { item: Bank }) => (
                      <TouchableOpacity
                        onLongPress={() => {
                          Alert.alert(
                            "Are your sure?",
                            "To Delete this Record : " + item?.motif,
                            [
                              // The "Yes" button
                              {
                                text: "Yes",
                                onPress: async () => {
                                  const state = await NetInfo.fetch();
                                  if (state.isConnected && state.isInternetReachable) {
                                    await deleteDoc(doc(db, "bank", item.transaction + ""));
                                  } else deleteDoc(doc(db, "bank", item.transaction + ""));
                                  dispatch(deleteRecord(item.transaction + ""));
                                },
                              },
                              {
                                text: "No",
                              },
                            ]
                          );
                        }}
                      >
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          //backgroundColor: selectTransaction.includes(transaction.transaction) ? 'green' : 'red'
                        }}>

                          <View style={{
                            width: '100%',
                            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
                            padding: 15,
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
                          }}>
                            <View>
                              <Text style={{ fontWeight: 'bold', color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>{item.motif}</Text>
                              <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>in: {convertDate(item.dateExp)} At : {item.timeExp} </Text>
                            </View>
                            <View>
                              <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>Amount: {item.amount.toFixed(2)}</Text>
                            </View>
                          </View>

                        </View>
                      </TouchableOpacity>
                    )}
                  />

                </View>
              )}
            </View>
          )
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={formad}
        onRequestClose={handleBank}
      >
        <View style={[styless.overlay]} >
          <View style={[styless.modalView, {
            height: "80%",
            width: '100%',
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary
          }]}>

            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
              <DropDownList
                Data={[{ ID: 1, Value: "Withdraw" }, { ID: 2, Value: "Deposit" }]}
                label={"Type Action"}
                styleLabel={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}
                styletextInput={{
                  width: '100%',
                  color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
                  backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
                }}
                onchange={(value) => {
                  setBankExp({ ...bankExp, cat: value })
                  //dispatch(setFilterBy(value))
                  //setCashType(value)
                }}
                selectedVal={bankExp.cat ?? ""}
                placerholder={'Select type By'}
              />
              <Text style={themeStyles.label}>Motif :</Text>
              <TextInput
                style={themeStyles.textInput}
                value={bankExp.motif ?? ''}
                onChangeText={(val) => setBankExp({ ...bankExp, motif: val })}
              />
              <Text style={themeStyles.label}>Amount :</Text>
              <TextInput
                keyboardType="numeric"
                style={themeStyles.textInput}
                value={amount}
                onChangeText={(val) => {
                  setAmount(val)
                }}
              />
              <TouchableOpacity
                style={themeStyles.button}
                onPress={async () => {
                  const cash = Number(Number(amount).toFixed(2));
                  const transactionId = user + "" + new Date().getTime();
                  //const amount = Number(Number(Price).toFixed(2));

                  if (!bankExp.motif || !amount || !bankExp.dateExp || !bankExp.user || !bankExp.cat) {
                    Alert.alert('Error', 'All fields are required.');
                    return;
                  }
                  const newBankExp: Bank = {
                    ...bankExp,
                    transaction: transactionId,
                    amount: cash
                  };
                  const state = await NetInfo.fetch();
                  if (state.isConnected && state.isInternetReachable) {
                    newBankExp.sync = true;
                    //setMessage("New Xpenses "+exp.description+" : "+exp.amount+" Mad ");
                    await setDoc(doc(db, 'bank', newBankExp.transaction + ""), newBankExp);
                    Alert.alert('Data Added On Server', 'With Success');
                  } else {
                    setDoc(doc(db, 'bank', newBankExp.transaction + ""), newBankExp);
                    Alert.alert('Data Added Locally', 'With Success');
                  }

                  dispatch(addCashFlow(newBankExp));
                  setAmount('');
                  setBankExp({ ...initialBank, user })
                }}
              >
                <Text style={themeStyles.buttonText}>Cash Flow</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            <TouchableOpacity
              style={themeStyles.button}

              onPress={() => {
                NetInfo.fetch().then(state => {
                  if (banks.length > 0 || banks != null) {
                    if (state.isConnected && state.isInternetReachable) {
                      banks.forEach(async (item: Bank) => {
                        if (!item.sync) {
                          item.sync = true;
                          await setDoc(doc(db, 'bank', item.transaction + ""), { ...item, createdAt: new Date(item.createdAt) } as Bank);
                          dispatch(updateBank(item));
                        }
                      });
                    } else {
                      banks.forEach(async (item: Bank) => {
                        setDoc(doc(db, 'bank', item.transaction + ""), { ...item, createdAt: new Date(item.createdAt) } as Bank);
                      });
                    }
                  }
                })
              }}
            >
              <Text style={themeStyles.buttonText}>Sync Data</Text>

            </TouchableOpacity>
            <View style={[styless.buttonContainer, {
              width: '100%',
              alignSelf: 'center',
            }]}>
              <TouchableOpacity
                style={styless.closeButton}
                onPress={handleBank}
              >
                <Ionicons name="close-circle" size={24} color={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >
      <TouchableOpacity style={{
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.Primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      }} onPress={handleBank}>
        <Text style={{
          color: Colors.text,
          fontSize: 20,
          fontWeight: 'bold'
        }}>+</Text>
      </TouchableOpacity>
    </View >
  );

}

function ModalScreen() {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

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
