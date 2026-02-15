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
import { LogoHeader } from '@/components/auth/logo-header';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';

type ForgotPasswordStep = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();
  const { sendOTP, verifyOTP, resetPassword } = useAuth();

  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isEmailValid = email.includes('@') && email.includes('.');
  const isOtpValid = otp.length === 6;
  const isPasswordValid = newPassword.length >= 6;
  const isPasswordMatch =
    newPassword === confirmPassword && newPassword.length > 0;

  const handleSendOTP = async () => {
    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await sendOTP(email);
      setStep('otp');
      setSuccessMessage(
        `We've sent a 6-digit code to ${email}. Please check your email.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!isOtpValid) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyOTP(email, otp);
      setStep('password');
      setSuccessMessage('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid || !isPasswordMatch) {
      setError('Passwords do not match or are too short');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);
      setStep('success');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
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
          source={require('@/assets/Background.jpg')}
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
              {/* Back Button */}
              <Pressable
                style={styles.backButton}
                onPress={handleBackToLogin}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color="#fff"
                />
              </Pressable>

              {/* Logo */}
              <LogoHeader />

              {/* Header */}
              <View style={styles.header}>
                {step === 'success' ? (
                  <>
                    <View
                      style={[
                        styles.successIcon,
                        { backgroundColor: '#51cf66' },
                      ]}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={48}
                        color='#fff'
                      />
                    </View>
                    <Text style={[styles.title, { color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }]}>
                      Password Reset
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        { color: 'rgba(255, 255, 255, 0.9)', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
                      ]}
                    >
                      Your password has been successfully reset
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.title, { color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }]}>
                      {step === 'email'
                        ? 'Reset Password'
                        : step === 'otp'
                          ? 'Verify Code'
                          : 'Create New Password'}
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        { color: 'rgba(255, 255, 255, 0.9)', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
                      ]}
                    >
                      {step === 'email'
                        ? 'Enter your email to receive a verification code'
                        : step === 'otp'
                          ? 'Enter the 6-digit code sent to your email'
                          : 'Create a strong new password'}
                    </Text>
                  </>
                )}
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

              {/* Success Message */}
              {successMessage && (
                <View
                  style={[
                    styles.successContainer,
                    {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.successText,
                      {
                        color: '#51cf66',
                      },
                    ]}
                  >
                    {successMessage}
                  </Text>
                </View>
              )}

              {/* Form Content */}
              {step === 'email' && (
                <View style={styles.form}>
                  <AuthInput
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    icon="mail"
                  />
                  <AuthButton
                    title="Send Verification Code"
                    onPress={handleSendOTP}
                    loading={loading}
                    disabled={!isEmailValid || loading}
                  />
                </View>
              )}

              {step === 'otp' && (
                <View style={styles.form}>
                  <AuthInput
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    icon="lock-closed"
                  />
                  <AuthButton
                    title="Verify Code"
                    onPress={handleVerifyOTP}
                    loading={loading}
                    disabled={!isOtpValid || loading}
                  />
                  <AuthButton
                    title="Send New Code"
                    onPress={handleSendOTP}
                    variant="secondary"
                    disabled={loading}
                  />
                </View>
              )}

              {step === 'password' && (
                <View style={styles.form}>
                  <AuthInput
                    placeholder="New password"
                    value={newPassword}
                    onChangeText={setNewPassword}
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
                  <AuthButton
                    title="Reset Password"
                    onPress={handleResetPassword}
                    loading={loading}
                    disabled={
                      !isPasswordValid || !isPasswordMatch || loading
                    }
                  />
                </View>
              )}

              {step === 'success' && (
                <View style={styles.form}>
                  <AuthButton
                    title="Back to Login"
                    onPress={handleBackToLogin}
                    disabled={loading}
                  />
                </View>
              )}
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
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
  successContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    fontWeight: '500',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
