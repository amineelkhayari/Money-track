import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from './DbSet';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Calculate {
  Expense: Double
  Credit:Double
  Debt:Double
}
// generic Class Reusable for All App
class Storage extends Database {
  constructor() {
    super()
   }

  // Method for save Data On lcoal storage
  storeData = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem(key, jsonValue);

    } catch (e) {
      // saving error
    }
  };
  // Method for get Data from lcoal storage

  getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        let val = JSON.parse(value);
        return val
      }
    } catch (e) {
      // error reading value
      return 'error'
    }
  };


  getTest = async (key: string, setData: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {

        setData(JSON.parse(value)
        );

      }
    } catch (e) {
      // error reading value
      return 'error'
    }
  };

  // get data with fetch it to json
  getDataObject = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        let val = JSON.parse(value);
        return val
      }
    } catch (e) {
      // error reading value
      return 'error'
    }
  };


  // remove a data store
  removeValue = async (key: string) => {
    try {
      let val = await AsyncStorage.removeItem(key);
      console.log("remove : ", val)
    } catch (e) {
      // remove error
    }

    console.log('Done.')
  }
  // show All Keys
  getAllKeys = async () => {
    let keys: any = []
    try {
      keys = await AsyncStorage.getAllKeys()
      console.log("Keys", keys)
    } catch (e) {
      // read key error
    }

    console.log(keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  }




  // clear All Storage

  clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch (e) {
      // clear error
    }

    console.log('Done.')
  }



   CalculateExpense = (selectedUser:string,data:any[],
    setData?: React.Dispatch<React.SetStateAction<Calculate | undefined>>
    ) => {
    let exp = 0
    let debt = 0
    let credit = 0


    //console.log(data)
    data.map((item: any, index: number) => {
      let usercreadit = JSON.parse(item.Structure);
      let lenghtUser = usercreadit["Payed"].length;
      if (item.PayedBy === selectedUser) {
        exp += item.Amount;

        usercreadit.Payed.forEach((it: any) => {
          if (!it.Payed) {
            credit += item.Amount / (lenghtUser + 1);

          } else {
            exp -= item.Amount / (lenghtUser + 1);
          }

        });
      } else {
        usercreadit.Payed.forEach((it: any) => {
          if (it.Name === selectedUser) {
            //console.log(usercreadit.Payed[i].Payed)
            if (it.Payed) {
              //console.log("expense: "+(exp+item.Amount/(userLenght+1)))
              exp += item.Amount / (lenghtUser + 1)
            } else {
              //console.log("Debts: "+item.Amount/(userLenght+1))
              debt += item.Amount / (lenghtUser + 1);

            }


          }


        });
      }




    }
    )
    let res:Calculate = {Expense:exp,Credit:credit, Debt:debt}
    if(setData != null) setData(res)
    // setDebtsAmount(debt)
    // setExpenseAmount(exp)
    // setCreditAmount(credit)
    

  }


}

export const str: Storage = new Storage();
