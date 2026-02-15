import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AuthButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: AuthButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDarkMode = colorScheme === 'dark';

  const primaryBgColor = colors.tint;
  const secondaryBgColor = isDarkMode ? '#262729' : '#F5F5F5';
  const primaryTextColor = isDarkMode ? '#000' : '#fff';
  const secondaryTextColor = colors.text;

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor:
            variant === 'primary'
              ? primaryBgColor
              : secondaryBgColor,
          opacity: disabled || loading ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? primaryTextColor : colors.text}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color:
                variant === 'primary'
                  ? primaryTextColor
                  : secondaryTextColor,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
