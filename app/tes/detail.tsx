import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, Dimensions} from 'react-native';
import { base64 } from "@/Interfaces/helper"
import QRCode from 'react-native-qrcode-svg';
import {  StrType } from '@/Interfaces/Users';
import { users } from '@/constants/user';
import {IData, db } from '@/Interfaces/DbSet';


const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const detailPage = () => {
    const params = useLocalSearchParams();

  const fetchedData:any = JSON.parse(base64.btoa(params.id as string));
  const Str:StrType = JSON.parse(fetchedData.Structure);
  const prixPerPerson = fetchedData.Amount / (Str.Payed.length+1)
  const [t, setTask] = useState<IData[]>([]);

  useEffect(() => {
    fetchData();
}, []);


const fetchData = () => {
  //db.fetchData('subCategory', setTasks);
  db.fetchDataQuery(`SELECT * FROM Expense WHERE PaymentTransaction = '${fetchedData.PaymentTransaction}'`, setTask)
console.log("aaa",t)

  //db.fetchDataQuery("SELECT SUM(Amount) as expense FROM Expense",setTask)
};

 

 
  

  return (
    <View style={{
      flex:1
    }} >
      
      <Text> Payment Transaction : {fetchedData.PaymentTransaction} </Text>
      <Text> Title               : {fetchedData.Title}              </Text>
      <Text> Payed By            : {fetchedData.PayedBy}</Text>
      <Text> Amount              : {fetchedData.Amount}</Text>
      <Text> Category            : {fetchedData.NameCat} / {fetchedData.NameSubCat}</Text>
      {
       fetchedData.PayedBy === params.user ? (
        Str.Payed.map((struc,index)=>{

          let sel = users.find(item => item.ID===struc.ID)
          //console.log(sel)
           return (
             <View style={{ 
               flexDirection:"row",
               alignItems:"center",
               justifyContent:"space-between"
             }}>
             <Text>{sel?.Name} :  {prixPerPerson }</Text>
             {
               !struc.Payed  ? (
                 <Button title="Pay" onPress={()=>{
                   struc.Payed=true;
                   fetchedData.Structure = Str;
                   db.UpdateItem("Expense",{Structure:JSON.stringify(Str)},"PaymentTransaction = '"+fetchedData.PaymentTransaction+"'")
                   

                   
                 }} />
               ) : (
                 <Text>Is Payed</Text>
               )
             }
             
             </View>
           )
         })
       ):(
        Str.Payed.map((struc,index)=>{

          let sel = users.find(item => item.ID===struc.ID)
          //console.log(sel)
           return (
             <View style={{ 
               flexDirection:"row",
               alignItems:"center",
               justifyContent:"space-between"
             }}>
             <Text>{sel?.Name} :  {prixPerPerson }</Text>
             {
                struc.Name== params.user ? (
                 <Button disabled={struc.Payed ? true : false } title={ struc.Payed ? "Payed": "Pay" } onPress={()=>{
                   struc.Payed=true;
                   fetchedData.Structure = JSON.stringify(Str);
                   //console.log(fetchedData)
                   db.UpdateItem("Expense",{Structure:JSON.stringify(Str)},"PaymentTransaction = '"+fetchedData.PaymentTransaction+"'")
                   
                 }} />
               ) : (
                 <Text>Not</Text>
               )
             }
             
             </View>
           )
         })

       )

          
        
      }
      
      





      <View style={{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
      }}>
        <QRCode size={300}
        quietZone={0}
        value={params.id as string} />
      </View>
     <View style={{
      position:"absolute",
      bottom:5,
      width:"100%"
     }}>
     <Button  onPress={() => {
        // log out Buffer
        
       delete fetchedData.ID;

       delete fetchedData.catID;
       delete fetchedData.NameSubCat;
       delete fetchedData.NameCat;
       delete fetchedData.catID;

       db.addItem('Expense',fetchedData);

      
        console.log(fetchedData)
        
      }} title="Import This Expense" />
     </View>
{/* 
      <Button onPress={() => {
        // log out Buffer
        const bs64 = base64.atob("amine")
        alert(bs64)
        console.log(bs64)
      }} title="Encode" />
      <Button onPress={() => {
        const ourBuffer = base64.btoa("YW1pbmU=");
        // log out Buffer
        alert(ourBuffer);
        console.log(ourBuffer)
      }} title="Decode" /> */}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
  },
  rooms: {
    fontSize: 16,
    color: 'grey',
    marginVertical: 4,

  },
  ratings: {
    fontSize: 16,

  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'grey',
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'grey',
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    opacity: 0.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
  },

  description: {
    fontSize: 16,
    marginTop: 10,
  },
});
export default detailPage