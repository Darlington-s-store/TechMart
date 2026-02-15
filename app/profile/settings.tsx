import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Switch } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, resetPassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Notifications state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [promotions, setPromotions] = useState(false);

    // Change password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const passwordsMatch = newPassword === confirmPassword && newPassword.length >= 6;

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        // Note: In a real app, you would verify the current password
        // For now, we'll simulate the password change
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            Alert.alert('Success', 'Password changed successfully', [
                {
                    text: 'OK',
                    onPress: () => {
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setShowChangePassword(false);
                    },
                },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setLoading(true);
        try {
            // Simulate saving notifications preferences
            await new Promise((resolve) => setTimeout(resolve, 1000));
            Alert.alert('Success', 'Notification preferences updated');
        } catch (error) {
            Alert.alert('Error', 'Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ title: 'Settings' }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Security Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Security</ThemedText>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setShowChangePassword(!showChangePassword)}
                    >
                        <View style={styles.settingLeft}>
                            <IconSymbol name="lock.circle" size={24} color="#FF6600" />
                            <ThemedText style={styles.settingLabel}>Change Password</ThemedText>
                        </View>
                        <IconSymbol
                            name={showChangePassword ? 'chevron.up' : 'chevron.down'}
                            size={18}
                            color="#ccc"
                        />
                    </TouchableOpacity>

                    {showChangePassword && (
                        <View style={styles.passwordForm}>
                            <View style={styles.formGroup}>
                                <ThemedText style={styles.label}>Current Password</ThemedText>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        placeholder="Enter current password"
                                        secureTextEntry={!showPasswords}
                                        editable={!loading}
                                    />
                                    <TouchableOpacity onPress={() => setShowPasswords(!showPasswords)}>
                                        <IconSymbol
                                            name={showPasswords ? 'eye.slash' : 'eye'}
                                            size={20}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <ThemedText style={styles.label}>New Password</ThemedText>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder="Enter new password (min 6 characters)"
                                        secureTextEntry={!showPasswords}
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <ThemedText style={styles.label}>Confirm Password</ThemedText>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder="Confirm new password"
                                        secureTextEntry={!showPasswords}
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            <View style={styles.passwordActions}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelBtn]}
                                    onPress={() => setShowChangePassword(false)}
                                    disabled={loading}
                                >
                                    <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.updateBtn,
                                        (loading || !passwordsMatch) && styles.disabledBtn,
                                    ]}
                                    onPress={handleChangePassword}
                                    disabled={loading || !passwordsMatch}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <ThemedText style={styles.updateBtnText}>Update Password</ThemedText>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity style={[styles.settingItem, styles.settingItemNoGap]}>
                        <View style={styles.settingLeft}>
                            <IconSymbol name="iphone" size={24} color="#FF6600" />
                            <View>
                                <ThemedText style={styles.settingLabel}>Active Sessions</ThemedText>
                                <ThemedText style={styles.settingSubtitle}>1 device</ThemedText>
                            </View>
                        </View>
                        <IconSymbol name="chevron.right" size={18} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>

                    <View style={styles.notificationItem}>
                        <View style={styles.notificationLeft}>
                            <IconSymbol name="bell.circle" size={24} color="#FF6600" />
                            <View>
                                <ThemedText style={styles.settingLabel}>Email Notifications</ThemedText>
                                <ThemedText style={styles.settingSubtitle}>
                                    Receive updates via email
                                </ThemedText>
                            </View>
                        </View>
                        <Switch
                            value={emailNotifications}
                            onValueChange={setEmailNotifications}
                            trackColor={{ false: '#ddd', true: '#FF660050' }}
                            thumbColor={emailNotifications ? '#FF6600' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.notificationItem}>
                        <View style={styles.notificationLeft}>
                            <IconSymbol name="message.circle" size={24} color="#FF6600" />
                            <View>
                                <ThemedText style={styles.settingLabel}>SMS Notifications</ThemedText>
                                <ThemedText style={styles.settingSubtitle}>
                                    Receive SMS updates
                                </ThemedText>
                            </View>
                        </View>
                        <Switch
                            value={smsNotifications}
                            onValueChange={setSmsNotifications}
                            trackColor={{ false: '#ddd', true: '#FF660050' }}
                            thumbColor={smsNotifications ? '#FF6600' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.notificationItem}>
                        <View style={styles.notificationLeft}>
                            <IconSymbol name="box.truck" size={24} color="#FF6600" />
                            <View>
                                <ThemedText style={styles.settingLabel}>Order Updates</ThemedText>
                                <ThemedText style={styles.settingSubtitle}>
                                    Order status and tracking
                                </ThemedText>
                            </View>
                        </View>
                        <Switch
                            value={orderUpdates}
                            onValueChange={setOrderUpdates}
                            trackColor={{ false: '#ddd', true: '#FF660050' }}
                            thumbColor={orderUpdates ? '#FF6600' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.notificationItem}>
                        <View style={styles.notificationLeft}>
                            <IconSymbol name="tag.circle" size={24} color="#FF6600" />
                            <View>
                                <ThemedText style={styles.settingLabel}>Promotions & Offers</ThemedText>
                                <ThemedText style={styles.settingSubtitle}>
                                    Special deals and discounts
                                </ThemedText>
                            </View>
                        </View>
                        <Switch
                            value={promotions}
                            onValueChange={setPromotions}
                            trackColor={{ false: '#ddd', true: '#FF660050' }}
                            thumbColor={promotions ? '#FF6600' : '#f4f3f4'}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveNotifBtn, loading && styles.disabledBtn]}
                        onPress={handleSaveNotifications}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <ThemedText style={styles.saveNotifBtnText}>Save Preferences</ThemedText>
                        )}
                    </TouchableOpacity>
                </View>

                {/* App Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>App</ThemedText>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <IconSymbol name="info.circle" size={24} color="#FF6600" />
                            <View>
                                <ThemedText style={styles.settingLabel}>App Version</ThemedText>
                                <ThemedText style={styles.settingSubtitle}>v1.0.0</ThemedText>
                            </View>
                        </View>
                        <IconSymbol name="checkmark.circle.fill" size={18} color="#00C896" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <IconSymbol name="doc.text.magnifyingglass" size={24} color="#FF6600" />
                            <ThemedText style={styles.settingLabel}>Terms & Conditions</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={18} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, styles.settingItemNoGap]}>
                        <View style={styles.settingLeft}>
                            <IconSymbol name="hand.raised" size={24} color="#FF6600" />
                            <ThemedText style={styles.settingLabel}>Privacy Policy</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={18} color="#ccc" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        paddingBottom: 40,
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingItemNoGap: {
        borderBottomWidth: 0,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    settingSubtitle: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    passwordForm: {
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        padding: 14,
        marginVertical: 12,
    },
    formGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        gap: 8,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 13,
        color: '#000',
    },
    passwordActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    button: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelBtnText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 13,
    },
    updateBtn: {
        backgroundColor: '#FF6600',
    },
    updateBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    notificationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    saveNotifBtn: {
        backgroundColor: '#FF6600',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    saveNotifBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    disabledBtn: {
        opacity: 0.6,
    },
});
