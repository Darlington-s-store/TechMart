import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
}

export function LogoHeader({ size = 150 }: LogoProps) {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          borderWidth: 10,
          borderColor: '#FF6600',
          backgroundColor: '#000', // Optional: adds a black background behind the logo if transparent
        }}
      >
        <Image
          source={require('../../assets/images/Logo.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
