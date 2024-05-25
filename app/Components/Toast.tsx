// All dep Import
import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View, useColorScheme } from 'react-native';
import { ThemeColor } from '../Interfaces/Themed';

interface ToastProps {
  message: string;
  showToast: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, showToast }) => {
  // Providers declare
  const colorScheme = useColorScheme();

  //State Declare
  const fadeAnim = useRef(new Animated.Value(0)).current;

    // delare evet effect
  useEffect(() => {
    if (showToast) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          hideToast();
        }, 2000); // Toast display duration
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showToast]);

    //Method Declare
  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  //style declare
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].Primary,
      borderRadius: 8,
      padding: 10,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    message: {
      color: ThemeColor[colorScheme === 'dark' ? 'dark' : 'light'].text ,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};



export default Toast;
