import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { useColorScheme} from 'react-native';
import { ThemeColor } from '../Interfaces/Themed';


interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
    const colorScheme=useColorScheme();
    return (
        <TouchableOpacity onPress={onChange} style={{
            flexDirection: 'row', padding: 5
        }}>
            <Fontisto name={checked ? 'checkbox-active' : 'checkbox-passive'} size={24} color={checked ? ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary : ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary} />

            <Text style={{ marginLeft: 10, fontSize: 16, alignContent: 'center',color:ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text }}>{label}</Text>
        </TouchableOpacity>
    );
};

export default Checkbox;
