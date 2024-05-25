//All dep Import
import { View, Text } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'

type pickerProps = {
    Data: any[],
    label: string,
    styleLabel?: {},
    styletextInput?: {},
    selectedVal: string,
    onchange: (value: string) => void; // Modify the onchange function to receive the selected value
    placerholder: string,
};

export function DropDownList(props: pickerProps) {
    // Providers declare
    // State Declare
    // Delare evet effect
    // Method Declare
    // Style declare

    return (
        <View>
            <Text style={props.styleLabel}>Select {props.label}</Text>
            <Picker
                style={props.styletextInput}
                selectedValue={props.selectedVal}
                onValueChange={(itemValue) => props.onchange(itemValue)} // Pass the selected value to onchange
            >
                <Picker.Item style={props.styletextInput} label={props.placerholder} value="" />
                {
                    props.Data.map((item, index) => {
                        return (
                            <Picker.Item key={index} style={props.styletextInput} label={item.Value} value={item.Value} />
                        )
                    })
                }
            </Picker>
        </View>
    );
}
