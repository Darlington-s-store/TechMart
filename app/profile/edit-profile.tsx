import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/use-auth';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

    const isFormValid = firstName.trim() && lastName.trim() && email.trim() && phoneNumber.trim();

    const handleSave = async () => {
        if (!isFormValid) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                firstName,
                lastName,
                email,
                phoneNumber,
            });
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ title: 'Edit Profile' }} />
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.largeAvatar}>
                        <ThemedText style={styles.largeAvatarText}>
                            {firstName[0]?.toUpperCase()}{lastName[0]?.toUpperCase()}
                        </ThemedText>
                    </View>
                    <TouchableOpacity style={styles.changeAvatarBtn}>
                        <IconSymbol name="camera.fill" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>First Name</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter first name"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Last Name</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter last name"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Email</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Phone Number</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                            editable={!loading}
                        />
                    </View>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <IconSymbol name="info.circle.fill" size={20} color="#0A7AFF" />
                    <ThemedText style={styles.infoText}>Your personal information is securely stored and will be used for order delivery and communication.</ThemedText>
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelBtn]}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.saveBtn, loading && styles.disabledBtn]}
                    onPress={handleSave}
                    disabled={loading || !isFormValid}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <ThemedText style={styles.saveBtnText}>Save Changes</ThemedText>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    largeAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FF6600',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    largeAvatarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 36,
    },
    changeAvatarBtn: {
        backgroundColor: '#FF6600',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6600',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    formSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#000',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E8F4FF',
        borderLeftWidth: 4,
        borderLeftColor: '#0A7AFF',
        padding: 12,
        borderRadius: 10,
        gap: 12,
    },
    infoText: {
        fontSize: 12,
        color: '#333',
        flex: 1,
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelBtnText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 14,
    },
    saveBtn: {
        backgroundColor: '#FF6600',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    disabledBtn: {
        opacity: 0.6,
    },
});
