import { users } from '@/constants/user';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, RadioButton } from 'react-native-paper';
import { Calculate, str } from '@/Interfaces/Storage';
import { Feather } from '@expo/vector-icons';
import CustomListItem from '@/components/CustomListing';
import Selection from '@/components/Selection';
import { IData, db } from '@/Interfaces/DbSet';
import { Expense, Expenses } from '@/Interfaces/Users';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';


type Props = {
  item: Expense
  index: number
}
export default function TabOneScreen() {
  //const str = new Storage();

  const [selectedUser, setselectedUser] = useState("0");
  const [t, SetT] = useState(false);


  const [Expensed, SetExpensed]: any = useState(0.0);
  const [Credit, SetCredit]: any = useState(0.0);
  const [debt, Setdebt]: any = useState(0.0);
  const [calculate, SetCalculate] = useState<Calculate>();

  const [test, SetTest] = useState(async () => {
    let va = await str.getData('Use')
    //selectedUser == va;
    //alert(t)
    if (va === undefined) confirm(selectedUser)//setselectedUser(va)

    else {
      setselectedUser(va)
      SetT(true)
      //console.log(selectedUser,"Value get from Storage",va)
      //fetchExpense()

      return true;
    }

  });




  const [ExpenseList, SetExpenseList] = useState<IData[]>([]);
  useEffect(() => {
    fetchExpense()


  }, [ExpenseList]);

  const fetchExpense = async () => {
    db.fetchDataQuery(`
    SELECT * from Expense, subCategory, category
    WHERE Expense.IdSubCat=subCategory.ID AND subCategory.catID=category.ID
    AND strftime('%m', DateExpense) =  strftime('%m', datetime('now','localtime'))
    order by DateExpense DESC
    `, SetExpenseList);
    //console.log(ExpenseList)
    let va = await str.getData('Use')
    setselectedUser(va)


    //console.log(str.CalculateExpense(selectedUser,ExpenseList))

    // let exp = 0
    // let debt = 0
    // let credit = 0
    // let diff = 0;
    // ExpenseList.map((item, index) => {
    //   //console.log("add", ExpenseList)
    //   let usercreadit = JSON.parse(item.Structure);


    //   if (item.PayedBy === selectedUser) {
    //     exp += item.Amount;
    //     let userLenght = usercreadit.Payed.length;
    //     //console.log("=====",usercreadit.Payed.length)
    //     if (userLenght > 0) {
    //       for (let i = 0; i < userLenght; i++) {
    //         if (!usercreadit.Payed[i].Payed) {
    //           credit += item.Amount / (userLenght + 1);

    //         } else {
    //           exp -= item.Amount / (userLenght + 1);
    //         }

    //       }
    //       //credit += item.Amount / (userLenght + 1) * userLenght;
    //     }
    //     console.log("User by me",)

    //   }
    //   else {
    //     let userLenght = usercreadit.Payed.length;
    //     //debt += item.Amount / (userLenght + 1);
    //     //console.log("=====",usercreadit.Payed.length)
    //     if (userLenght > 0) {
    //       //exp += item.Amount / (userLenght + 1);

    //       for (let i = 0; i < userLenght; i++) {
    //         //alert(selectedUser)
    //         if(usercreadit.Payed[i].Name === selectedUser){
    //           //console.log(usercreadit.Payed[i].Payed)
    //           if(usercreadit.Payed[i].Payed){
    //             //console.log("expense: "+(exp+item.Amount/(userLenght+1)))
    //             exp += item.Amount/(userLenght+1)
    //           }else{
    //             //console.log("Debts: "+item.Amount/(userLenght+1))
    //             debt+=item.Amount/(userLenght+1);

    //           }


    //         }


    //       }
    //       //credit += item.Amount / (userLenght + 1) * userLenght;
    //     }


    //   }
    //   //console.log(usercreadit.shared.length)

    // })
    str.CalculateExpense(selectedUser, ExpenseList, SetCalculate)


    SetExpensed(calculate?.Expense)
    Setdebt(calculate?.Debt)
    SetCredit(calculate?.Credit);
    //console.log("Expense: ", exp, "Debt", debt)


  }



  return (
    <SafeAreaView style={styles.container}>




      {

        (t === false) ? (
          <>
            <View style={styles.radioGroup}>

              {users.map((user, index) => {
                return (

                  <View style={styles.radioButton}>
                    <RadioButton.Android
                      value={user.Name}
                      key={user.Name}
                      status={selectedUser === user.Name ?
                        'checked' : 'unchecked'}
                      onPress={() => setselectedUser(user.Name)}
                      color="#007BFF"
                    />
                    <Text style={styles.radioLabel}>
                      {user.Name}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity key="StoreData" style={styles.textInput} onPress={() => {


              if (selectedUser != '0') {
                SetT(true)
                str.storeData('Use', selectedUser);
                // dt.SetUpDataBase(`CREATE TABLE if NOT EXISTS categoery (
                //   IdCat INTEGER PRIMARY KEY AUTOINCREMENT,
                //   NameCat TEXT NOT NULL UNIQUE

                // );
                // `)

              }
              else {

                alert("Please Select user ")
              }


            }}><Text style={{ textAlign: 'center' }}>Select User</Text></TouchableOpacity>

          </>

        ) : (
          <View><View style={styles.fullName}>
            <Avatar.Image size={60} source={require('../../assets/images/spending.png')} />


            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Welcome Mrs :</Text>

              <Text style={{ color: '#4A2D5D', fontSize: 20 }}>
                {selectedUser}
              </Text>
            </View>
          </View>
            <View style={styles.card}>
              <View style={styles.cardBottom}>
                <TouchableOpacity onPress={() => {
                  fetchExpense()
                }}
                >
                  <FontAwesome size={25} name="refresh" />
                </TouchableOpacity>
              </View>


              <TouchableOpacity onPress={() => {
              
        
              }} >
                <View style={styles.cardTop}>

                  <Text style={{ textAlign: 'center', color: 'aliceblue', flexDirection: "row", justifyContent: "space-between" }}>
                    Total Expense

                  </Text>
                  <Text style={{ fontSize: 20, textAlign: 'center', color: 'aliceblue' }}>
                    $ {Expensed}
                  </Text>
                </View>

              </TouchableOpacity>

              <View style={styles.cardBottom}>

                <TouchableOpacity onPress={()=> ""}>
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
                      $ {Credit}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>router.push({
                pathname: `/tr`, params: { name:'"debt' }
              })}>
                  <View>
                    <View style={styles.cardBottomSame}>
                      <Feather name='arrow-up' size={18} color='red' />
                      <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                        Debts
                      </Text>
                    </View>
                    <Text style={{ textAlign: 'center' }}>
                      $ {debt}
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
            {/* Start for Recent Transaction */}

            <View style={styles.recentTitle}>
              <Text style={{ color: '#4A2D5D' }}>
                Recent Transactions
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>   router.push({
                  pathname: `/tr`
                })}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>


            {/* Loop for transaction */}
            <View style={{ flex: 1, flexDirection: "row", height: "auto" }}>
              <CustomListItem
                expenseList={ExpenseList}
                userLocal={selectedUser}

              />
            </View>



            <View >
              {/* loop */}

              {/* endLoop */}
            </View>





          </View>
        )
      }

      {/* Design Partie Balance Expense And Credit And Debt */}
      <View style={styles.container}>

      </View>

      {/* <TouchableOpacity key="GetData" style={styles.textInput} onPress={async () => {

        //         console.log("t Vallue",selectedUser)
        let vat = (t === false) && 'lll';
        str.removeValue("Use")
        SetT(false)
        setselectedUser("0")
        //   console.log(t,"Data Load",vat)
        // str.getAllKeys()

        dt.getFromTable('SELECT * FROM categoery WHERE IdCat = ?  ', [1])

        //

        // alert(await str.getData('User'));

      }}><Text style={{ textAlign: 'center' }}>Remove User</Text></TouchableOpacity> */}



    </SafeAreaView >
  );
}

const styles = StyleSheet.create({

  radioGroup: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    gap: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 5,
    flexWrap: 'wrap',
    padding: 10,



  },
  radioButton: {
    textAlign: "center",
    alignItems: "center"

  },
  radioLabel: {
    textAlign: 'left'
  },
  textInput: {
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    width: "100%"
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
  },
  fullName: {
    flexDirection: 'row',
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
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  recentTransactions: {
    backgroundColor: 'white',
    width: '100%',
  },
  seeAll: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  plusButton: {
    backgroundColor: '#535F93',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  containerNull: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },

});