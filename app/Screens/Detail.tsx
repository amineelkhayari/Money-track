
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { str } from '../Interfaces/Storage';
import { db } from '../Interfaces/Firebase';




const ExpenseDetailPage = () => {
    const params = useLocalSearchParams();
    const [exp, setExpenses] = useState<any>();
    const [docsID, setdocsID] = useState<string>('');
    const [selectUser, setSelectedUser] = useState<string>('');


    useEffect(() => {
        str.getData("user", setSelectedUser)

        getTotalDebtForUser()
            .then((data) => {
                setExpenses(data);
            })
            .catch((error) => {
                //console.error('Error:', error);

            });
    }, [params.id,exp]); // Add params.id to the dependency array

    const [participants, setParticipants] = useState<Participants[]>([]);

    const handlePay = async (participantIndex: number) => {
        
        try {
            // Get a reference to the document
            const documentRef = doc(db, 'users', docsID);
            
            const participant = exp?.participants.find((participant: Participants) => participant.Value === participants[participantIndex].Value);
            if (participant) {
                // Update the 'Payed' status for the participant
                participant.Payed = true;


                // Update the document with the modified data
                //console.log("dddd", exp)
                //console.log('Participant not found',exp);

                await updateDoc(documentRef, exp);
                Alert.alert(participant.Value," send money to "+exp.paidBy);
                setExpenses(exp)

               // console.log('Participant payed status updated successfully');
            } else {
               // console.log('Participant not found');
            }

            //} else {
            //console.log('Document does not exist');
            //}
        } catch (error) {
           // console.error('Error updating participant payed status:', error);
        }

    };

    async function getTotalDebtForUser() {
        const transaction = params.id;
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
                cat:expenseData.cat,
                timeExp:expenseData.timeExp,
                transaction: expenseData.transaction,
                paidBy: expenseData.paidBy,
                participants: expenseData.participants,
                sync: expenseData.sync
            };
            setParticipants(expense.participants);
            setdocsID(docsID);
            return expense;
        } else {
            //console.log("No expense found for transaction ID:", transaction);
            Alert.alert("404","No Data Found")
            return null;
        }
    }

    if (!exp) {
        return <View style={{
            paddingTop: StatusBar.currentHeight,
            flex: 1,
            justifyContent: 'center', // Vertically center content
            alignItems: 'center',

        }}><Text>Loading...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.expenseCard}>
                <Text style={styles.heading}>Description: {exp.description}</Text>
                <Text style={styles.text}>Total Price: {exp.amount} MAD</Text>
                <Text style={styles.text}>Category: {exp.cat}</Text>

                <Text style={styles.text}>Date  : {exp.dateExp} At : {exp.timeExp}</Text>
                <Text style={styles.text}>Paid By: {exp.paidBy}</Text>
                <Text style={styles.text}>Transaction ID: {exp.transaction}</Text>
                <Text style={styles.subHeading}>Participants:</Text>
                {participants.map((participant, index) => (
                    <View key={index} style={styles.participant}>
                        <Text>{participant.Value}</Text>
                        {participant.Payed || exp.paidBy == participant.Value
                            ? (
                                <Text style={styles.paidText}>Paid : {(exp.amount/exp.participants.length).toFixed(2)} MAD</Text>
                            ) : (
                                ((exp.paidBy == selectUser || participant.Value == selectUser) &&
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight
    },
    expenseCard: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
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
    },
    payButtonright: {
        backgroundColor: '#007bff',
    },
    payButtonleft: {
        backgroundColor: '#333',
    },
    payButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    payButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    paidText: {
        color: 'green',
        fontWeight: 'bold',
    },
});

export default ExpenseDetailPage;






