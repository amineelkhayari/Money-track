import { Expense, Expenses } from '@/Interfaces/Users';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { base64 } from "@/Interfaces/helper"
import { router, Navigator, useNavigation } from 'expo-router';


import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, Button
} from 'react-native';

type ItemData = {
  id: string;
  title: string;
};
type Props = {
  expenseList: any,
  userLocal: string
}





type ItemProps = {
  item: Expense;

  userSelect: string
};

const Item = ({ item, userSelect }: ItemProps) => (
  <>


    <TouchableOpacity onPress={() => {
      router.push({
        pathname: `/tes/detail`, params: { id: base64.atob(JSON.stringify(item)), user: userSelect }
      });

    }} style={[styles.item, { backgroundColor: item.PayedBy == userSelect ? "red" : 'green' }]}>
      <View>
        <Text style={[{ color: "white" }]}>This Item `{item.Title}({JSON.parse(item.Structure).Payed.length + 1})`</Text>
        <Text style={[{ color: "white" }]}>Payed By: {item.PayedBy === userSelect ? "Me" : item.PayedBy}</Text>

      </View>
      <View>



        <Text style={[{ color: 'white' }]}>- $ {item.PayedBy == userSelect ? item.Amount : item.Amount / (JSON.parse(item.Structure).shared.length + 1)}</Text>
        {
          item.PayedBy != userSelect && (
            <Text style={[{ color: "#fff", textAlign: "center" }]}> / {item.Amount}</Text>

          )
        }
      </View>

    </TouchableOpacity>
  </>
);

const CustomListItem = ({ expenseList, userLocal }: Props) => {
  const [selectedId, setSelectedId] = useState<number>();

  const renderItem = ({ item }: { item: Expense }) => {
    const backgroundColor = item.ID === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.ID === selectedId ? 'white' : 'black';

    return (
      // <Link href={`/detail/${base64.atob(JSON.stringify(item))}`} asChild>


      <Item
        item={item}
        userSelect={userLocal}
       
      />

    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expenseList}
        renderItem={renderItem}

        keyExtractor={item => item.PaymentTransaction}
        extraData={selectedId}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
  },
});

export default CustomListItem;