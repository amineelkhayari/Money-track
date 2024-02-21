import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Users } from '@/Interfaces/Users'
import { users } from '@/constants/user';

const Selection = () => {
    const [opencard, SerOpencard] = useState(0);
    let select=-1;

     function Selected(index:number):void{
       
           select = index+1;
        alert(select)
    }
    return (
        <View style={styles.card}>
            {opencard != 0 && (
                <TouchableOpacity style={styles.cardPreview} onPress={() => console.log("aa")}>

                    <Text style={styles.previewText}>Select Categoery</Text>
                    <Text style={styles.previewdData}>Amine</Text>

                </TouchableOpacity>
            )}
            {opencard === 0 && (
                <>
                    <Text style={styles.cardHeader}>Hello</Text>
                    <View style={styles.cardBody}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {
                                users.map((user, index) => {
                                    return (
                                        <TouchableOpacity onPress={()=>Selected(index)} >
                                            <Text style={select === user.ID ? styles.placeSelected : styles.place} >{user.Name}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }


                        </ScrollView>

                    </View>

                </>

            )}
        </View>
    )
}

export default Selection

const styles = StyleSheet.create({
    placesContainer: {
        flexDirection: 'row',
        gap: 25,
    },
    place: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    placeSelected: {
        borderColor: "grey",
        borderWidth: 2,
        borderRadius: 10,
        width: 100,
        height: 100,
    },
    cardHeader: {
        fontSize: 24,
        padding: 20,
    },
    cardBody: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cardPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    previewText: {
        fontSize: 14,
        color: 'grey',
    },
    previewdData: {
        fontSize: 14,
        color: '#333',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        margin: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        gap: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        bottom: 5
    },
    container: {
        backgroundColor: "#fff",
        height: "100%",

    },
    heading: {
        color: "green",
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
    },
    addButton: {
        padding: 10,
        margin: 10,
    },
    heading2: {
        color: "black",
        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold",
    },
    heading3: {
        color: "black",
        fontSize: 20,
        textAlign: "center",
    },
    label: {
        color: "black",
        fontSize: 16,
        textAlign: "left",
        fontWeight: "bold",
        marginLeft: 10,
    },
    expenseTile: {
        // column with 3 cells
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "lightgrey",
        width: "95%",
        padding: 10,
        margin: 10,
    },
    expenseTileText: {
        fontSize: 20,
        width: "22%",
        textAlign: "center",
    },
    formAdd: {
        // display: "none",
    },
    textInput: {
        borderRadius: 12,
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        margin: 10,
    },
});