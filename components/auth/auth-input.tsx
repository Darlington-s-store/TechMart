import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon?: string;
}

export function AuthInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  autoCapitalize = 'none',
  icon,
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={'#333'}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: '#000',
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={'#999'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconButton}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={'#333'}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    marginRight: 12,
  },
  iconButton: {
    padding: 8,
  },
});
