
// All dep Import
import * as React from 'react';
import { StatusBar, useWindowDimensions, StyleSheet, ImageBackground, Image, useColorScheme } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ModalScreen from './Screens/Form';
import History from './Screens/Transaction';
import Expenses from './Screens/Expense';
import Credits from './Screens/Credit';
import Debts from './Screens/Debts';
import { Ionicons } from '@expo/vector-icons';
import { UsernameProvider } from './Components/userName';
import { ThemeColor } from './Interfaces/Themed';



export default function Home() {
  // Providers declare
  const layout = useWindowDimensions();
  const colorScheme = useColorScheme();

  //State Declare
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'history', title: 'history' },
    { key: 'ajout', title: 'New' },
    { key: 'expense', title: 'Expense' },
    { key: 'credit', title: 'Credit' },
    { key: 'debt', title: 'Debt' }

  ]);
  // delare evet effect

  //Method Declare
  const renderScene = SceneMap({
    history: History,
    ajout: ModalScreen,
    expense: Expenses,
    credit: Credits,
    debt: Debts

  });
  const getTabBarIcon = (props: any) => {
    const { route, focused } = props
    const active = ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary;
    const inActive = "#fff";
    if (route.key === 'history') {
      return <Ionicons name="analytics-outline" size={30} color={focused ? active : inActive} />
    }
    if (route.key === 'expense') {
      return <Ionicons name="list-circle-outline" size={30} color={focused ? active : inActive} />
    }
    if (route.key === 'credit') {
      return <Ionicons name="arrow-up-circle-outline" size={30} color={focused ? active : inActive} />
    }
    if (route.key === 'debt') {
      return <Ionicons name="arrow-down-circle-outline" size={30} color={focused ? active : inActive} />

    }
    if (route.key === 'ajout') {

      return <Ionicons name="add-circle-outline" size={30} color={focused ? active : inActive} />

    }
  }

  //styles Declare
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
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary, // Change background color as desired
    },
  })

  return (

    <TabView
      style={{ paddingTop: StatusBar.currentHeight }}

      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props =>
        <TabBar
          indicatorStyle={{ borderBottomColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary, borderBottomWidth: 2 }} // Customize the border color and width

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