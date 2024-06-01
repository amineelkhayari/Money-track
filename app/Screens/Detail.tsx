// All dep Import
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { collection, doc, getDocs, query, updateDoc, where, deleteDoc, Timestamp } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, useColorScheme } from 'react-native';
import { db } from '../Interfaces/Firebase';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColor } from '../Interfaces/Themed';
import { useUsername } from '../Components/userName';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense, updateExpense } from '../Interfaces/expenseSlice';
import moment from 'moment-timezone';
import NetInfo from '@react-native-community/netinfo';


const ExpenseDetailPage = () => {

    // Providers declare
    const colorScheme = useColorScheme();
    const { username } = useUsername();
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const user = useSelector((state: any) => state.user.user);
    const expenses: Expense[] = useSelector((state: any) => state.expense.expenses);
    const dispatch = useDispatch();


    //State Declare
    const [exp, setExpenses] = useState<any>();
    const [docsID, setdocsID] = useState<string>('');
    const [participants, setParticipants] = useState<Participants[]>([]);

    // delare evet effect
    useEffect(() => {

        getTotalDebtForUser()
            .then((data) => {
                setExpenses(data);
            })
            .catch((error) => {
                //console.error('Error:', error);

            });
    }, [params.id, exp]); // Add params.id to the dependency array

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Expense Detail",
            headerLeft: () => (
                <TouchableOpacity style={styless.roundButton} onPress={() => {

                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                }}>
                    <Ionicons name="chevron-back" size={24} color={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styless.bar}>
                    <TouchableOpacity style={[styless.roundButton, { backgroundColor: "red" }]} onPress={() => {
                        if (exp.paidBy === user)
                            Alert.alert(
                                "Are your sure?",
                                "To Delete this Record : " + exp?.description,
                                [
                                    // The "Yes" button
                                    {
                                        text: "Yes",
                                        onPress: async () => {
                                            const state = await NetInfo.fetch();
                                            if(state.isConnected && state.isInternetReachable){
                                                await deleteDoc(doc(db, "users", exp?.transaction));
                                            }else deleteDoc(doc(db, "users", exp?.transaction));
                                            dispatch(deleteExpense(exp.transaction));

                                            router.back();
                                            //useNavigation().goBack();

                                        },
                                    },
                                    // The "No" button
                                    // Does nothing but dismiss the dialog when tapped
                                    {
                                        text: "No",
                                        onPress: () => {
                                        }
                                    },
                                ]
                            );
                        else
                            Alert.alert("You Dont have Permission", 'For Delete This Record')
                    }}>
                        <Ionicons name="trash-bin-sharp" size={22} color={'white'} />
                    </TouchableOpacity>
                </View>
            )


        });
    }, [exp])
    const combineDateTime = (date: string, time: string) => {
        // Convert date string to milliseconds since epoch
        const dateMilliseconds = new Date(date).getTime();
        // Split time string into hours, minutes, and seconds
        const [hours, minutes, seconds] = time.split(':').map(Number);
        // Add time in milliseconds to date milliseconds
        const combinedDateTime = new Date(dateMilliseconds);
        combinedDateTime.setHours(hours, minutes, seconds);
        // Return combined date and time
        return combinedDateTime;
    };
    //Method Declare
    const handlePay = async (participantIndex: number) => {
        try {
            const state = await NetInfo.fetch();

            // Get a reference to the document
            const documentRef = doc(db, 'users', docsID);
            const participant = exp?.participants.find((participant: Participants) => participant.Value === participants[participantIndex].Value);
            if (participant) {
                // Update the 'Payed' status for the participant
                let sync = false;
                const timestamp = exp.createdAt;
                //console.log();
                const DateConvert: Date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                //console.log('converted date', DateConvert);
                participant.Payed = true;
                const datetimeStr = `${exp.dateExp} ${exp.timeExp}`;

                // Parse the combined datetime string using moment
                const datetime = moment(datetimeStr, 'M/D/YYYY h:mm:ss A');
                if (state.isConnected && state.isInternetReachable) {
                    sync = true;
                    await updateDoc(documentRef, { ...exp, createdAt: datetime.toDate(), sync })
                } else {

                    updateDoc(documentRef, { ...exp, createdAt: datetime.toDate(), sync });
                }

                dispatch(updateExpense({ ...exp, createdAt: datetime.toDate(), sync }))
                //Alert.alert(participant.Value, " Paid " + (exp.amount / exp.participants.length).toFixed(2) + " " + exp.paidBy);
                //setExpenses(exp)


            }
        } catch (error) {
            // console.error('Error updating participant payed status:', error);
        }

    };
    async function getTotalDebtForUser() {
        const transaction = params.id;
        if (params.id === undefined || params.id == null || params.id == "")
            useNavigation().goBack();
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('transaction', '==', transaction));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docsID = querySnapshot.docs[0].id;
            const expenseData = querySnapshot.docs[0].data();
            const expense: Expense = {
                amount: expenseData.amount,
                description: expenseData.description,
                dateExp: expenseData.dateExp,
                cat: expenseData.cat,
                timeExp: expenseData.timeExp,
                transaction: expenseData.transaction,
                paidBy: expenseData.paidBy,
                participants: expenseData.participants,
                sync: expenseData.sync,
                createdAt: expenseData.createdAt
            };
            setParticipants(expense.participants);
            setdocsID(docsID);
            return expense;
        } else {
            useNavigation().goBack();
        }
    }

    //styles Declare
    const styless = StyleSheet.create({

        roundButton: {
            width: 40,
            height: 40,
            borderRadius: 50,
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
            alignItems: 'center',
            justifyContent: 'center',
            color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
            marginLeft: 10,
            marginRight: 10
        },
        bar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
        },
        header: {
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text,
            height: 100,
            opacity: 1,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary,
        }
    });
    const styles = StyleSheet.create({
        badge: {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: -10,
            top: 0,
        },
        badgeText: {
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
        },
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
            paddingTop: StatusBar.currentHeight,
            height: "100%"
        },
        expenseCard: {
            //backgroundColor:ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary            ,
            padding: 20,
            marginBottom: 15,
            borderRadius: 10,
            elevation: 3,
            shadowColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        heading: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary
        },
        text: {
            fontSize: 16,
            marginBottom: 5,
            color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text
        },
        subHeading: {
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 5,
        },
        participant: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
            color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text
        },
        payButtonright: {
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
        },
        payButtonleft: {
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
        },
        payButton: {
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
        },
        payButtonText: {
            color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background,
            fontWeight: 'bold',
        },
        paidText: {
            color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary
            ,
            fontWeight: 'bold',
        },
    });




    if (!exp) {
        return <View style={{
            paddingTop: StatusBar.currentHeight,
            flex: 1,
            justifyContent: 'center', // Vertically center content
            alignItems: 'center',
            backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Background

        }}><Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>Loading...</Text></View>;
    }

    const Badge = ({ isSync }: { isSync: boolean }) => {
        return (
            <View style={[styles.badge, { backgroundColor: isSync ? 'green' : "red", width: 50, height: 50, borderRadius: 10 / 2 }]}>
                <Text style={styles.badgeText}>{isSync ? 'Online' : 'Offline'}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Secondary} barStyle="light-content" />

            <View style={styles.expenseCard}>
                <Badge isSync={exp.sync} />

                <Text style={styles.heading}>Description: {exp.description}</Text>
                <Text style={styles.text}>Total Price: {exp.amount} MAD</Text>
                <Text style={styles.text}>Category: {exp.cat}</Text>

                <Text style={styles.text}>Date  : {exp.dateExp} At : {exp.timeExp}</Text>
                <Text style={styles.text}>Paid By: {exp.paidBy}</Text>
                <Text style={styles.text}>Transaction ID: {exp.transaction}</Text>
                <Text style={styles.heading}>Participants:</Text>
                {participants.map((participant, index) => (
                    <View key={index} style={styles.participant}>
                        <Text style={{ color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>{participant.Value}</Text>
                        {participant.Payed || exp.paidBy == participant.Value
                            ? (
                                <Text style={styles.paidText}>Paid : {(exp.amount / exp.participants.length).toFixed(2)} MAD</Text>
                            ) : (
                                ((exp.paidBy == user || participant.Value == user) &&
                                    (
                                        <TouchableOpacity onPress={() => handlePay(index)} style={[styles.payButton, styles.payButtonright]}>
                                            <Text style={styles.payButtonText}>Pay {(exp.amount / participants.length).toFixed(2)}</Text>
                                        </TouchableOpacity>
                                    ))
                            )}
                    </View>
                ))}
            </View>


        </View>
    );
};


export default ExpenseDetailPage;
