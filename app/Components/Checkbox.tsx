import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
    return (
        <TouchableOpacity onPress={onChange} style={{
            flexDirection: 'row', padding: 5
        }}>
            <Fontisto name={checked ? 'checkbox-active' : 'checkbox-passive'} size={24} color={checked ? 'blue' : 'gray'} />

            <Text style={{ marginLeft: 10, fontSize: 16, alignContent: 'center' }}>{label}</Text>
        </TouchableOpacity>
    );
};

export default Checkbox;
