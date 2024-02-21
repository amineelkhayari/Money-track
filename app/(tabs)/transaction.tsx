import { View, Text, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'

const transaction = () => {
    return (
        <SafeAreaView
            style={styles.container}>
            <View style={styles.header}>
                <Text>{Date()}</Text>
                
            </View>
            <View style={styles.boxContainer}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{ flexBasis: "100%" }}>
                        <Picker
                            style={{ width: "100%" }}
                        >
                            <Picker.Item
                                key={0}
                                label="Daily"
                                value="Daily"
                            />
                            <Picker.Item
                                key={0}
                                label="Weekly"
                                value="Weekly"
                            />
                            <Picker.Item
                                key={0}
                                label="Monthly"
                                value="Monthly"
                            />
                            <Picker.Item
                                key={0}
                                label="Yearly"
                                value="Yearly"
                            />
                        </Picker>
                    </View>
                  
                </View>
                <View style={styles.box}>
                    <View style={styles.inner}>

                    </View>
                </View>
                <View style={styles.box}>
                    <View style={styles.inner}>

                    </View>
                </View>
                <View style={styles.box}>
                    <View style={styles.inner}>

                    </View>
                </View>
            </View>




        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: "100%",
        height: "15%",
        backgroundColor: "#c8c8c8",
        alignItems: "center",
        justifyContent: "center"
    },
    boxContainer: {
        width: "100%",
        height: "85%",
        backgroundColor: "red",
        flexDirection: "row",
        padding: 5,
        flexWrap: 'wrap',
        justifyContent:"space-between"

    },
    box: {
        width: "49%",
        height: "40%",
        padding: 5,
        backgroundColor: "green"
    },
    inner: {
        flex: 1,
        backgroundColor: "#c8c8c8",
        alignItems: "center",
        justifyContent: "center"
    }

})
export default transaction