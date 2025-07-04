import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

export const BlobLoader = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.blob,
          {
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
  },
  blob: {
    width: 70,
    height: 70,
    backgroundColor: 'red',
    borderRadius: 999,
    opacity: 0.9,
  },
});
