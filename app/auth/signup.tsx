import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthLink } from '@/components/auth/auth-link';
import { LogoHeader } from '@/components/auth/logo-header';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();
  const { signUp } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation
  const isFirstNameValid = firstName.trim().length > 0;
  const isLastNameValid = lastName.trim().length > 0;
  const isEmailValid = email.includes('@') && email.includes('.');
  const isPhoneValid = phoneNumber.length >= 8;
  const isPasswordValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword && password.length > 0;
  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordValid &&
    isPasswordMatch &&
    agreeToTerms &&
    !loading;

  const handleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      await signUp(firstName, lastName, email, password, phoneNumber);
      router.replace('/(tabs)');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during sign up'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.brand.gradient}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Image
          source={require('@/assets/Background1.jpg')}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Logo */}
              <LogoHeader />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  Create Account
                </Text>
                <Text style={styles.subtitle}>
                  Sign up to shop Laptops, Phones & more
                </Text>
              </View>

              {/* Error Message */}
              {error && (
                <View
                  style={[
                    styles.errorContainer,
                    {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.errorText,
                      {
                        color: '#ff6b6b',
                      },
                    ]}
                  >
                    {error}
                  </Text>
                </View>
              )}

              {/* Form */}
              <View style={styles.form}>
                <View style={styles.nameRow}>
                  <View style={styles.nameInputContainer}>
                    <AuthInput
                      placeholder="First name"
                      value={firstName}
                      onChangeText={setFirstName}
                      icon="person"
                    />
                  </View>
                  <View style={styles.nameInputContainer}>
                    <AuthInput
                      placeholder="Last name"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                <AuthInput
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  icon="mail"
                />

                <AuthInput
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  icon="call"
                />

                <AuthInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="lock-closed"
                />

                <AuthInput
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  icon="lock-closed"
                />

                {/* Terms & Conditions Checkbox */}
                <Pressable
                  style={styles.checkboxContainer}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: agreeToTerms
                          ? '#fff'
                          : 'rgba(255, 255, 255, 0.3)',
                        borderColor: agreeToTerms
                          ? '#fff'
                          : 'rgba(255, 255, 255, 0.5)',
                      },
                    ]}
                  >
                    {agreeToTerms && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={colors.brand.muted}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      { color: 'rgba(255, 255, 255, 0.9)' },
                    ]}
                  >
                    I agree to the Terms & Conditions
                  </Text>
                </Pressable>

                {/* Sign Up Button */}
                <AuthButton
                  title="Create Account"
                  onPress={handleSignUp}
                  loading={loading}
                  disabled={!isFormValid}
                />
              </View>

              {/* Login Link */}
              <AuthLink
                label="Already have an account?"
                linkText="Sign in"
                onPress={() => router.push('/auth/login')}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  form: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  nameInputContainer: {
    flex: 1,
  },
  errorContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    color: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
