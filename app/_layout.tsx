import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { db, IData } from '@/Interfaces/DbSet';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      db.createTableManually(`
          CREATE TABLE if NOT EXISTS category (
	        ID INTEGER PRIMARY KEY AUTOINCREMENT,
	        NameCat TEXT NOT NULL UNIQUE
          );`);
      db.createTableManually(`
          CREATE TABLE if NOT EXISTS subCategory (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            NameSubCat TEXT NOT NULL UNIQUE,
            catID INTEGER,
              FOREIGN KEY (catID) 
                REFERENCES category (IdCat) 
                   ON DELETE CASCADE 
                   ON UPDATE NO ACTION
            
          );
          `)
      db.createTableManually(`CREATE TABLE if NOT EXISTS Expense (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Title TEXT,
            PaymentTransaction TEXT UNIQUE,
            DateExpense DATE DEFAULT (datetime('now','localtime')),
            PayedBy TEXT NOT NULL,
            Amount REAL NOT NULL,
            Structure TEXT,
            IdSubCat INTEGER,
             FOREIGN KEY (IdSubCat) 
                REFERENCES subCategory (IdCat) 
                   ON DELETE CASCADE 
                   ON UPDATE NO ACTION   
            
          );`);
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />

      </Stack>
      
    </ThemeProvider>
  );
}
