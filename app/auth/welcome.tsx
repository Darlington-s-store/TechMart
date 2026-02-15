import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { LogoHeader } from '@/components/auth/logo-header';

export default function AuthGatewayScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Background Image & Gradient */}
            <ImageBackground
                source={require('@/assets/Background.jpg')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFillObject}
                />
            </ImageBackground>

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <LogoHeader size={180} />
                    <ThemedText type="title" style={styles.title}>Welcome</ThemedText>
                    <ThemedText style={styles.subtitle}>Sign in to track orders and save favorites.</ThemedText>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push('/auth/signup')}
                    >
                        <ThemedText style={styles.primaryButtonText}>Create Account</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/auth/login')}
                    >
                        <ThemedText style={styles.secondaryButtonText}>Sign In</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <ThemedText style={styles.guestButtonText}>Continue as Guest</ThemedText>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>
                        By continuing you agree to our Terms & Privacy Policy
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        gap: 16,
        marginBottom: 24,
    },
    primaryButton: {
        backgroundColor: '#FF6600',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    guestButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    guestButtonText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        textAlign: 'center',
    },
});
