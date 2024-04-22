import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

interface ToastProps {
  message: string;
  showToast: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, showToast }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  message: {
    color: '#fff',
  },
});

export default Toast;
