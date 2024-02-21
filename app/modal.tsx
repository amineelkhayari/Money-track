import { StatusBar } from 'expo-status-bar';
import { Button, Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { users } from '@/constants/user';
import { str } from '@/Interfaces/Storage';
import { useNavigation } from 'expo-router';
import { IData, db } from '@/Interfaces/DbSet';


export default function ModalScreen() {
  const navigation = useNavigation();

  const [Title, SetTitle]: any = useState();
  const [PayTransaction, SetPayTransaction]: any = useState()

  const [PayedBy, SetPayedBy]: any = useState();
  const [Amount, setAmount]: any = useState(0);
  const [SouAmount, SetSouAmount]: any = useState(0);
  const [Structure, SetStructure]: any = useState();


  const [userSelected, setUserSelected]: any = useState([]);
  const [opencard, SetPoenCard] = useState(0);
  const [perPerson, SetPerPerson]: any = useState();
  const [subCateList, SetsubCateList] = useState<IData[]>([]);

  const [test, SetTest] = useState<any>(async () => {
    let va = await str.getData('Use')
    //selectedUser == va;
    //alert(t)
    if (va === undefined) {
      alert("please Select user First")
      navigation.goBack()
    }

    else {
      SetPayedBy(va)
      SetTest(va)
      SetPayTransaction(va + new Date().getTime())
      fetchData();
      db.fetchDataQuery("select * from subCategory", SetsubCateList);
      return va;
      //console.log(selectedUser,"Value get from Storage",va)
    }

  });
  const [categoryList, SetCategoryList] = useState<IData[]>([]);
  const [catSelected, SetCatSelect] = useState(0);
  const [SubCatSelected, SetSubCatSelect] = useState(0);
  

  const [testNew, SettestNew] = useState<any[]>([]);

  const [ExpenseList, SetExpenseList] = useState<IData[]>([]);
  const fetchExpense = () => {
    db.fetchData("Expense", SetExpenseList);
  }

  const fetchData = () => {
    db.fetchData('category', SetCategoryList);


    //db.fetchDataQuery("SELECT SUM(Amount) as expense FROM Expense",setTask)
  };
  const add = () => {

   

    let str: any = {
      "shared": userSelected,
      "Payed": testNew
    }

    const data = {
      Title: Title,
      PaymentTransaction: PayTransaction,
      PayedBy: PayedBy,
      Amount: Amount,
      Structure: JSON.stringify(str),
      IdSubCat: SubCatSelected
    }


    db.addItem('Expense', data, fetchExpense);
    SetTitle();
    SetPayTransaction(PayedBy + new Date().getTime())
    setAmount(0)
    SetStructure()
    SetSubCatSelect(0)
    SetCatSelect(0)
    setUserSelected([])


    //console.log(data)

    // Create user table

  }
  useEffect(() => {
    SetSouAmount((Amount / (userSelected.length + 1)).toFixed(2))

  }, [userSelected])

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'dark'} />

      <Text style={styles.heading3}>Expense Transaction Serie: {PayTransaction} </Text>

      {/* Input field for expense name */}
      <Text style={styles.label}>Expense Name</Text>
      <TextInput
        onChangeText={(value) => SetTitle(value)}
        style={styles.textInput}
        placeholder="Enter the expense name"
        value={Title}
      />
      {/* Input field for expense Amount */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        keyboardType="number-pad"
        onChangeText={(value) => {
          // Ensure only numeric values are entered for the Amount
          value = value.replace(/[^0-9]/g, "");
          setAmount(value)
        }}
        value={Amount}
        style={styles.textInput}
        placeholder="[0-9]"
      />
      {/* Add categoeru and sub cat */}



      <Text style={styles.label}>Pay By</Text>

      <Picker
        style={styles.textInput}
        selectedValue={PayedBy}
        onValueChange={(itemValue, itemIndex) => {
          SetPayedBy(itemValue)
        }}
      >
        {users.map((user, index) => {
          return (
            <Picker.Item
              key={user.ID}
              label={user.Name === test ? "Me " : user.Name}
              value={user.Name}
            />
          );
        })}
      </Picker>

      {/* Add who shared payed */}
      <View style={styles.card}>
        {opencard != 2 && (
          <TouchableOpacity key={opencard} style={styles.cardPreview} onPress={() => SetPoenCard(2)}>

            <Text style={styles.previewText}>Select User</Text>
            <Text style={styles.previewdData}>{userSelected.length + 1}/{users.length}</Text>

          </TouchableOpacity>
        )}
        {opencard === 2 && (
          <>
            <TouchableOpacity style={styles.cardPreview} onPress={() => {
              SetPoenCard(0)
            }}>
              <Text style={styles.cardHeader}>User Selected : </Text>
            </TouchableOpacity>
            <View style={styles.cardBody}>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {users.filter((item, i) => item.Name != PayedBy.trim()).map((item, i) => (

                  <TouchableOpacity key={i} style={item.isChecked == true && styles.placeSelected} onPress={() => {
                    //user[userSelected].isChecked = !user[userSelected].isChecked;
                    if (userSelected.includes(item.ID) === false) {
                      //console.log("exlude", PayedBy.trim())

                      setUserSelected([...userSelected, item.ID])
                      
                      let newT :any =  
                        {
                        ID:item.ID,
                        Name:item.Name,
                        Payed:false
                      }
                      
                      
                      testNew.push(newT);

                    } else {
                      let clone: any[] = [...userSelected];
                      let index = clone.findIndex(i => i == item.ID);
                      let indexArr = testNew.findIndex(i=> i.ID === item.ID)
                      clone.splice(index, 1);
                      testNew.splice(indexArr,1)
                      setUserSelected([...clone])

                      console.log(index, 'clone', clone);
                    }
                    //console.log(userSelected,userSelected.length)                
                  }} >
                    <Text style={userSelected.includes(item.ID) == true ? styles.placeSelected : styles.place} >{item.Name}/{SouAmount}</Text>
                  </TouchableOpacity>
                ))}


              </ScrollView>

            </View>

          </>

        )}
      </View>

      {/* Select Category and sub category */}
      <Text style={styles.label}>Select Category: </Text>

      <Picker
        style={{ width: "100%" }}
        selectedValue={catSelected}
        onValueChange={(itemValue, itemIndex) => {
          SetCatSelect(itemValue)
        }}
      >
        <Picker.Item
          key={0}
          label="Choose Cat"
          value={0}
        />
        {categoryList.map((cat, index) => {
          return (
            <Picker.Item
              key={cat.ID}
              label={cat.NameCat}
              value={cat.ID}
            />
          );
        })}
      </Picker>
      <Picker
        style={{ width: "100%" }}
        selectedValue={SubCatSelected}
        onValueChange={(itemValue, itemIndex) => {
          SetSubCatSelect(itemValue)
        }}
      >
        <Picker.Item
          key={0}
          label="Choose Sub Cat"
          value={0}
        />
        {subCateList.filter(cat => cat.catID === catSelected).map((cat, index) => {
          return (
            <Picker.Item
              key={cat.ID}
              label={cat.NameSubCat}
              value={cat.ID}
            />
          );
        })}
      </Picker>

      <View style={styles.row}>
        {/* Add Expense button */}
        <Button
          key="Add"

          onPress={() => {
            add();

            // Update the chart data to reflect the new expense

          }}
          title="Add"

        />

        {/* Cancel button to close the form
					without adding an expense */}
        <Button
          onPress={() =>console.log(testNew)
          }
          title="Cancel"
          key="Cancel"
        />
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
    </View>
  );





}

const styles = StyleSheet.create({
  placesContainer: {
    flexDirection: 'row',
    gap: 25,
  },
  place: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeSelected: {
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  cardHeader: {
    fontSize: 24,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  previewText: {
    fontSize: 14,
    color: 'grey',
  },
  previewdData: {
    fontSize: 14,
    color: '#333',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 5,
    position: "absolute",
    width: "100%",
    height: 50,
    gap: 25,
    alignItems: "center",

  },
  container: {
    backgroundColor: "#fff",
    height: "100%",

  },
  heading: {
    color: "green",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  addButton: {
    padding: 10,
    margin: 10,
  },
  heading2: {
    color: "black",
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  heading3: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
  label: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: 10,
  },
  expenseTile: {
    // column with 3 cells
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "lightgrey",
    width: "95%",
    padding: 10,
    margin: 10,
  },
  expenseTileText: {
    fontSize: 20,
    width: "22%",
    textAlign: "center",
  },
  formAdd: {
    // display: "none",
  },
  textInput: {
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
});
