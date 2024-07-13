// All dep Import
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './Interfaces/Firebase';
import { useFonts } from 'expo-font';
import NetInfo from '@react-native-community/netinfo';
import { Alert, StatusBar, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemeColor } from './Interfaces/Themed';
import { UsernameProvider } from './Components/userName';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './Interfaces/Store';
import { updateExpense } from './Interfaces/expenseSlice';
import moment from 'moment';


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
    if (loaded) {
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

  // delare evet effect
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
        if (expenses != null && expenses.length > 0) {

          expenses.map(async (exp: Expense) => {
            if (!exp.sync) {
              //sconst DateConvert:Date = new Date(timestamp["seconds"] * 1000 + timestamp.nanoseconds / 1000000);
              exp.sync = true;
              await setDoc(doc(db, 'users', exp.transaction), { ...exp, createdAt: new Date(exp.createdAt) } as Expense);
              dispatch(updateExpense(exp));
            }
          });
        }
      } else {
        Alert.alert("Data Being Loaded" + expenses.length);
        if (expenses.length != 0) {
          expenses.map((exp: Expense) => {
            // dispatch(updateExpense(exp);
            const datetimeStr = `${exp.dateExp} ${exp.timeExp}`;

            // Parse the combined datetime string using moment
            const createdAt = moment(datetimeStr, 'M/D/YYYY h:mm:ss A').toDate();
            setDoc(doc(db, 'users', exp.transaction), { ...exp, createdAt });
            //dispatch(updateExpense(exp));
          });
          Alert.alert("Data Offline is Loaded");
        }
        Alert.alert("Data is loaded");

      }
    }); // end nwt info
  }, []); // end useEffect
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
