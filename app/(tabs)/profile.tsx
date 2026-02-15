import { StyleSheet, TouchableOpacity, ScrollView, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { useOrders } from '@/hooks/use-cart';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut, updateProfile } = useAuth();
    const { orders } = useOrders();
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await signOut();
            router.replace('/auth/login');
        } finally {
            setLoading(false);
        }
    };

    const getUserInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        return 'U';
    };

    const recentOrders = orders.slice(-3).reverse();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Header Card */}
                <View style={styles.headerCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <ThemedText style={styles.avatarText}>{getUserInitials()}</ThemedText>
                        </View>
                        <View style={styles.headerInfo}>
                            <ThemedText style={styles.userName}>{user?.firstName} {user?.lastName}</ThemedText>
                            <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
                            <ThemedText style={styles.userPhone}>{user?.phoneNumber || 'No phone added'}</ThemedText>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => router.push('/profile/edit-profile')}
                    >
                        <IconSymbol name="pencil" size={18} color="#FF6600" />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/orders')}>
                        <View style={styles.statIcon}>
                            <IconSymbol name="bag.fill" size={24} color="#FF6600" />
                        </View>
                        <ThemedText style={styles.statValue}>{orders.length}</ThemedText>
                        <ThemedText style={styles.statLabel}>Orders</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.statCard} onPress={() => router.push('/profile/addresses')}>
                        <View style={styles.statIcon}>
                            <IconSymbol name="mappin.circle.fill" size={24} color="#FF6600" />
                        </View>
                        <ThemedText style={styles.statValue}>{user?.addresses?.length || 0}</ThemedText>
                        <ThemedText style={styles.statLabel}>Addresses</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.statCard} onPress={() => router.push('/profile/settings')}>
                        <View style={styles.statIcon}>
                            <IconSymbol name="gearshape.fill" size={24} color="#FF6600" />
                        </View>
                        <ThemedText style={styles.statValue}>3</ThemedText>
                        <ThemedText style={styles.statLabel}>Settings</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Recent Orders Section */}
                {recentOrders.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>Recent Orders</ThemedText>
                            <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
                                <ThemedText style={styles.viewAll}>View All</ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.recentOrdersList}>
                            {recentOrders.map((order) => (
                                <TouchableOpacity
                                    key={order.id}
                                    style={styles.orderItem}
                                    onPress={() => router.push(`/order-details/${order.id}`)}
                                >
                                    <View style={styles.orderItemContent}>
                                        <ThemedText style={styles.orderNumber}>{order.orderNumber}</ThemedText>
                                        <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
                                    </View>
                                    <View style={styles.orderItemRight}>
                                        <ThemedText style={styles.orderTotal}>₵{order.total.toFixed(2)}</ThemedText>
                                        <IconSymbol name="chevron.right" size={16} color="#ccc" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Account Settings Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Account</ThemedText>
                    <View style={styles.settingsGroup}>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => router.push('/profile/edit-profile')}
                        >
                            <View style={styles.settingLeft}>
                                <IconSymbol name="person.crop.circle" size={24} color="#FF6600" />
                                <ThemedText style={styles.settingLabel}>Edit Profile</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={18} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => router.push('/profile/addresses')}
                        >
                            <View style={styles.settingLeft}>
                                <IconSymbol name="location.circle" size={24} color="#FF6600" />
                                <ThemedText style={styles.settingLabel}>Addresses</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={18} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => router.push('/profile/settings')}
                        >
                            <View style={styles.settingLeft}>
                                <IconSymbol name="gearshape" size={24} color="#FF6600" />
                                <ThemedText style={styles.settingLabel}>Settings</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={18} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Help & Support Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Help & Support</ThemedText>
                    <View style={styles.settingsGroup}>
                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <IconSymbol name="questionmark.circle" size={24} color="#FF6600" />
                                <ThemedText style={styles.settingLabel}>FAQs</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={18} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <IconSymbol name="phone.circle" size={24} color="#FF6600" />
                                <ThemedText style={styles.settingLabel}>Contact Us</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={18} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    style={[styles.signOutButton, loading && styles.disabledBtn]}
                    onPress={handleSignOut}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <IconSymbol name="arrowtriangledown.fill" size={16} color="#fff" />
                            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
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
    },
    headerCard: {
        backgroundColor: '#FFF5F0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: '#FF6600',
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FF6600',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 20,
    },
    headerInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    userPhone: {
        fontSize: 12,
        color: '#999',
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF6600',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    statIcon: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    viewAll: {
        fontSize: 12,
        color: '#FF6600',
        fontWeight: '600',
    },
    recentOrdersList: {
        gap: 8,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    orderItemContent: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 12,
        color: '#666',
    },
    orderItemRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    orderTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FF6600',
    },
    settingsGroup: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingItem_last: {
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
        fontWeight: '500',
        color: '#000',
    },
    signOutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 24,
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    signOutText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
