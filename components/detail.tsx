import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { base64 } from "@/Interfaces/helper"
import QRCode from 'react-native-qrcode-svg';



const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const detail = () => {
    //const { id,data } = useLocalSearchParams<{ id: string,data:string }>();
    const params:{id:string,data:string} = useLocalSearchParams();


    const navigation = useNavigation();

    const shareListing = async () => {
        try {
            await Share.share({
                title: 'test',
                url: 'https:local.com',
            });
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        console.log(params.data.toLocaleString())
    })


    useLayoutEffect(() => {

        navigation.setOptions({
            headerTitle: '',
            headerTransparent: false,
            presentation: 'Modal',
            animation: 'fade',

            headerBackground: () => (
                <View style={[styles.header]}></View>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
                        <Ionicons name="share-outline" size={22} color={'#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton}>
                        <Ionicons name="heart-outline" size={22} color={'#000'} />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={'#000'} />
                </TouchableOpacity>
            ),
        });
    }, []);




    return (
        <View style={{
            flex: 1
        }} >

            <Text>{params.id}</Text>
            <Text>{params.data}</Text>
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <QRCode size={300}
                    quietZone={0}
                    value={params.data } />
            </View>
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
export default detail