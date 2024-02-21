import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';


const detailWithoutQrCode = () => {
    //const { id,data } = useLocalSearchParams<{ id: string,data:string }>();
    const params = useLocalSearchParams();









    return (
        <View style={{
            flex: 1
        }} >

            <Text>{params.id}</Text>
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}>

            </View>
        </View>
    )
}


export default detailWithoutQrCode