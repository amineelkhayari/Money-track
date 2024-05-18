// All dep Import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { addDoc, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './Interfaces/Firebase';
import { useFonts } from 'expo-font';
import NetInfo from '@react-native-community/netinfo';
import { str } from './Interfaces/Storage';
import { Alert, StatusBar, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemeColor } from './Interfaces/Themed';
import { UsernameProvider } from './Components/userName';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  // Providers declare

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
    const unsubscribe = NetInfo.addEventListener((state) => {
      setRechable(state.isInternetReachable ?? false);
      setIsConnected(state?.isConnected ?? false); // Ensure state.isConnected is properly handled
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
      asyncData();
      SplashScreen.hideAsync();
    }

  }, [loaded]);

  //Method Declare


  //styles Declare

  if (!loaded) {
    return null;
  }

  return <Layout />

}

function Layout() {
  // Providers declare
  const colorScheme = useColorScheme();

  //State Declare

  //Method Declare

  // delare evet effect


  //styles Declare


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
    </ThemeProvider>

  );
}
