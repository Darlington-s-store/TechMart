import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface AuthLinkProps {
  label: string;
  linkText: string;
  onPress: () => void;
}

export function AuthLink({ label, linkText, onPress }: AuthLinkProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.link}>{linkText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    marginRight: 4,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
