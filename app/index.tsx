import * as React from 'react';
import { Modal, StatusBar, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import ModalScreen from './Screens/Form';
import History from './Screens/Transaction';
import Expenses from './Screens/Expense';
import Credits from './Screens/Credit';
import Debts from './Screens/Debts';

const renderScene = SceneMap({
  history: History,
  ajout: ModalScreen,
  expense: Expenses,
  credit:Credits,
  debt:Debts

});

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
    style={{ paddingTop: StatusBar.currentHeight }}

      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}