import React, { useState, useEffect, FC } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { db, IData } from '@/Interfaces/DbSet';

const SubCatCRUD = () => {
  const [tasks, setTasks] = useState<IData[]>([]);
  const [Category, SetCategory]: any = useState();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    db.fetchData('category', setTasks);
    console.log(tasks)
    //db.fetchDataQuery("SELECT SUM(Amount) FROM Expense",setTask)
  };

  const addTask = () => {

    db.addItem('category', { NameCat: Category.trim() }, fetchData);
  };

  return (
    <View style={{ flex: 1, margin: 10 }}>
      <View style={{
        flexDirection: 'row', justifyContent: "space-between", borderWidth: 1
      }}>
        <TextInput
          maxLength={20}
          style={{
            borderColor: "#333",

            flexBasis: "70%",
            paddingLeft: 10,
            paddingRight: 10
          }}
          value={Category}
          placeholder='food'
          onChangeText={(val) => SetCategory(val)} />
        <View style={{
          flexBasis: "30%",
          borderLeftWidth: 1,
          width: "100%",
          backgroundColor: "#333"


        }}>
          <Button

            onPress={addTask} title="Add Category" />
        </View>
      </View>


      <View style={{ flex: 1, paddingTop: 20 }}>
        <View style={styles.table}>
          <View>
            <Text key="#category">#</Text>
          </View>
          <View>
            <Text key="#categoryName">Name</Text>
          </View>
          <View style={styles.textTable}>
            <Text key="#categoryAction">Action</Text>
          </View>


        </View>
        {tasks.map(task => (
          <View style={styles.table}>
            <View style={styles.textTable}>
              <Text style={styles.textTable} key={task.ID}>{task.ID}</Text>
            </View>
            <View style={styles.textTable}>
              <Text key={task.NameCat}>{task.NameCat}</Text>
            </View>
            <View style={styles.textTable}>

              <Button title='Delete'
                onPress={() => {
                  db.deleteItem("category", { ID: task.ID }, fetchData)
                }}
              />


            </View>

          </View>
        ))}
      </View>


    </View>
  );

}



const styles = StyleSheet.create({
  table: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 15,
    alignItems: "center",
    alignContent: "flex-start"
  },
  textTable: {
    justifyContent: 'flex-start'
  }
})


export { SubCatCRUD };
