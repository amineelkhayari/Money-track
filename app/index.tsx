import * as React from 'react';
import {  StatusBar, useWindowDimensions, StyleSheet, ImageBackground,Image } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ModalScreen from './Screens/Form';
import History from './Screens/Transaction';
import Expenses from './Screens/Expense';
import Credits from './Screens/Credit';
import Debts from './Screens/Debts';
import { Ionicons } from '@expo/vector-icons';

const renderScene = SceneMap({
  history: History,
  ajout: ModalScreen,
  expense: Expenses,
  credit:Credits,
  debt:Debts

});
const getTabBarIcon = (props:any) => {

  const {route} = props

    if (route.key === 'history') {

     //return <Image style={styles.image} source={require('../assets/icons/texpense.png')} />
     return  <Ionicons name="analytics-outline" size={30} color={'#fff'} />

    } 
    if(route.key === 'expense') {

    //return <Image style={styles.image} source={require('../assets/icons/expense.png')} />
    return  <Ionicons name="list-circle-outline" size={30} color={'#fff'} />

  }
    if(route.key === 'credit') {

      //return <Image style={styles.image} source={require('../assets/icons/lend.png')} />
      return  <Ionicons name="arrow-up-circle-outline" size={30} color={'#fff'} />
  
    }
      if(route.key === 'debt') {

       // return <Image style={styles.image} source={require('../assets/icons/debt.png')} />
        
                return  <Ionicons name="arrow-down-circle-outline" size={30} color={'#fff'} />

      }
        if(route.key === 'ajout') {

          return  <Ionicons name="add-circle-outline" size={30} color={'#fff'} />

          }
  }

export default function Home() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'history', title: 'history' },
    { key: 'ajout', title: 'New' },
    { key: 'expense', title: 'Expense' },
    { key: 'credit', title: 'Credit' },
    { key: 'debt', title: 'Debt' }

  ]);

  return (
    <TabView
    style={{ paddingTop: StatusBar.currentHeight,backgroundColor:"#fff" }}

      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props =>
          <TabBar
          indicatorStyle={{ borderBottomColor: '#fff', borderBottomWidth: 2,zIndex:10000 }} // Customize the border color and width

              {...props}
              renderIcon={
                  props => getTabBarIcon(props)
              }
              labelStyle={styles.noLabel}
              style={styles.tabBar}

          />
      }
      tabBarPosition={'bottom'}
    />
  );
}

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
    backgroundColor: '#333', // Change background color as desired
  },
})