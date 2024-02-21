import React, { useState, useEffect, FC } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { db, IData } from '@/Interfaces/DbSet';
import { Picker } from '@react-native-picker/picker';








export default function Test() {
    const [tasks, setTasks] = useState<IData[]>([]);
    const [t, setTask] = useState<IData[]>([]);
    const [catSelected, SetCatSelect] = useState(0);

    const [Category, SetCategory]: any = useState();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        //db.fetchData('subCategory', setTasks);
        db.fetchDataQuery(`SELECT subCategory.ID as ID,NameSubCat,NameCat FROM subCategory,category where subCategory.catID= category.ID`, setTasks)
        db.fetchData('category', setTask);


        //db.fetchDataQuery("SELECT SUM(Amount) as expense FROM Expense",setTask)
    };

    const addTask = () => {

        db.addItem('subCategory', { NameSubCat: Category.trim(), catID: catSelected }, fetchData);
    };

    return (
        <View style={{ flex: 1, margin: 10 }}>
            <Text>Choose Category:</Text>

            <Picker
                style={{ width: "100%" }}
                selectedValue={catSelected}
                onValueChange={(itemValue, itemIndex) => {
                    SetCatSelect(itemValue)
                }}
            >
                <Picker.Item
                    key={0}
                    label="Choose Cat"
                    value={0}
                />
                {t.map((user, index) => {
                    return (
                        <Picker.Item
                            key={user.ID}
                            label={user.NameCat}
                            value={user.ID}
                        />
                    );
                })}
            </Picker>

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

                        onPress={addTask} title="Add Sub Category" />
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
                    <View>
                        <Text key="#categoryName">Cat</Text>
                    </View>
                    <View style={styles.textTable}>
                        <Text key="#categoryAction">Action</Text>
                    </View>


                </View>
                <ScrollView>
                    {tasks.map(task => (
                        <View style={styles.table}>
                            <View style={styles.textTable}>
                                <Text style={styles.textTable} key={task.ID}>{task.ID}</Text>
                            </View>
                            <View style={styles.textTable}>
                                <Text key={task.NameSubCat}>{task.NameSubCat}</Text>
                            </View>
                            <View>
                                <Text key="#categoryName">{task.NameCat}</Text>
                            </View>
                            <View style={styles.textTable}>
                                <Button title='Delete'
                                onPress={()=>{
                                    db.deleteItem("subCategory",{ID:task.ID},fetchData)
                                }}
                                />
                            </View>

                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};




const styles = StyleSheet.create({
    table: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderWidth: 1,
        padding: 15
    },
    textTable: {
        justifyContent: 'flex-start'
    }
})

