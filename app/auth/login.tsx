import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();
  const { signIn, signInWithPhone } = useAuth();

  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation
  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const isPhoneValid = phoneNumber.length >= 8;
  const isOtpValid = otp.length >= 4;

  const isFormValid = isPhoneLogin
    ? otpSent
      ? isPhoneValid && isOtpValid
      : isPhoneValid
    : isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      if (isPhoneLogin) {
        if (!otpSent) {
          // Simulate sending OTP
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setOtpSent(true);
          setLoading(false);
          return;
        }
        await signInWithPhone(phoneNumber, otp);
      } else {
        await signIn(email, password);
      }
      router.replace('/(tabs)');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during login'
      );
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
          source={require('@/assets/Back1.jpg')}
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
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  {isPhoneLogin ? 'Sign in with Phone' : 'Sign in to your account'}
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
                {isPhoneLogin ? (
                  <>
                    <AuthInput
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      icon="call"
                      editable={!otpSent}
                    />
                    {otpSent && (
                      <AuthInput
                        placeholder="Enter OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        icon="key"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <AuthInput
                      placeholder="Email address"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      icon="mail"
                    />

                    <AuthInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      icon="lock-closed"
                    />
                  </>
                )}

                {/* Login Method Toggle */}
                <AuthLink
                  label={isPhoneLogin ? 'Prefer Email?' : 'Prefer Phone?'}
                  linkText={isPhoneLogin ? 'Sign in with Email' : 'Sign in with Phone'}
                  onPress={() => {
                    setIsPhoneLogin(!isPhoneLogin);
                    setOtpSent(false);
                    setError('');
                  }}
                />

                {!isPhoneLogin && (
                  <AuthLink
                    label=""
                    linkText="Forgot Password?"
                    onPress={() => router.push('/auth/forgot-password')}
                  />
                )}

                {/* Login Button */}
                <AuthButton
                  title={
                    isPhoneLogin
                      ? otpSent
                        ? 'Verify & Sign In'
                        : 'Send OTP'
                      : 'Sign In'
                  }
                  onPress={handleLogin}
                  loading={loading}
                  disabled={!isFormValid && !loading}
                />
              </View>

              {/* Sign Up Link */}
              <AuthLink
                label="Don't have an account?"
                linkText="Create account"
                onPress={() => router.push('/auth/signup')}
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
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  form: {
    marginBottom: 32,
  },
  errorContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
