import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import { str } from '@/Interfaces/Storage';
import {router} from "expo-router"

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  console.log(hasPermission, scanned);
  const isFocused = useIsFocused();
  
 const [User, SetUser] = useState("");
 const [test, SetTest] = useState(async () => {
   let va = await str.getData('Use')

   //selectedUser == va;
   if (va === undefined) {
     alert("please Select user First")
     //navigation.goBack()
   }

   else {

     console.log(va)
     SetUser(va)
     //console.log(selectedUser,"Value get from Storage",va)
   }

 });

  useEffect(() => {
    (async () => {
      setScanned(false);
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    //https://stackoverflow.com/a/71807265
     Alert.alert(
      "Are your sure?",
      "To Import This Article",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            router.push({
              pathname: `/tes/detail`, params: { id: data, user: User }
            });
        
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );

   
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isFocused ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
