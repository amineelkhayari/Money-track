// All dep Import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Timestamp, addDoc, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './Interfaces/Firebase';
import { useFonts } from 'expo-font';
import NetInfo from '@react-native-community/netinfo';
import { str } from './Interfaces/Storage';
import { Alert, StatusBar, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemeColor } from './Interfaces/Themed';
import { UsernameProvider } from './Components/userName';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './Interfaces/Store';
import { resetExpenses, updateExpense } from './Interfaces/expenseSlice';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  // Providers declare
  const colorScheme = useColorScheme();


  //State Declare
  const [isConnected, setIsConnected] = useState<boolean>(false); // Default to true to handle initial state
  const [Rechable, setRechable] = useState<boolean>(false); // Default to true to handle initial state
  const [loaded, error] = useFonts({
    am: require('../assets/fonts/SpaceMono-Regular.ttf')
  });

  // delare evet effect
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const asyncData = async () => {
      var value = await AsyncStorage.getItem('LocalExpense');
      if (value != null) {
        let val: Expense[] = JSON.parse(value);

        if (val.length > 0) {
          val.forEach(async (load: Expense) => {
            load.sync = !load.sync;


            load.createdAt = new Date(load.createdAt);
            if (isConnected && Rechable) await setDoc(doc(db, 'users', load.transaction), load);
            else setDoc(doc(db, 'users', load.transaction), load);

          });
          if (isConnected && Rechable) {
            await str.removeValue('LocalExpense')
            Alert.alert("Data Sync", "With Success");
          }


        }
      }

      //
    }
    if (loaded) {
      // asyncData();
      SplashScreen.hideAsync();
    }

  }, [loaded]);

  //Method Declare


  //styles Declare

  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  )

}

function Layout() {
  // Providers declare
  const colorScheme = useColorScheme();
  const expenses: Expense[] = useSelector((state: any) => state.expense.expenses);
  const dispatch = useDispatch();



  //State Declare
  const [isConnected, setIsConnected] = useState<boolean>(false); // Default to true to handle initial state
  const [Rechable, setRechable] = useState<boolean>(false); // Default to true to handle initial state

  // delare evet effect
 
  useEffect(() => {
    
    NetInfo.fetch().then(state=>{
      //console.log(state)
      if(state.isConnected && state.isInternetReachable){
        if (expenses != null && expenses.length > 0 ){

          expenses.map(async (exp: Expense) => {
            if (!exp.sync) {
              //sconst DateConvert:Date = new Date(timestamp["seconds"] * 1000 + timestamp.nanoseconds / 1000000);
              exp.sync = true;
              await setDoc(doc(db, 'users', exp.transaction), { ...exp, createdAt: new Date(exp.createdAt) } as Expense);
              dispatch(updateExpense(exp));
            }
          });
        }


      }else{
        if (expenses != null && expenses.length > 0) {
          expenses.map((exp: Expense) => {
  
           // dispatch(updateExpense(exp);
            setDoc(doc(db, 'users', exp.transaction), { ...exp, createdAt: new Date(exp.createdAt) } as Expense);
            dispatch(updateExpense(exp));
  
          });
          // console.log(expenses)
        }

      }
    }); // end nwt info
   
  }, []);
  //Method Declare

  //styles Declare


  return (

    <UsernameProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
          },
          headerTintColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Screens/Detail" options={{
          animation: 'fade',
          headerShown: true,
          headerTransparent: false,
          presentation: 'card'
        }} />
      </Stack>
    </UsernameProvider>


  );
}
