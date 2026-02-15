import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    const handleSignOut = async () => {
        await signOut();
        router.replace('/auth/login');
    };

    const renderAddressItem = ({ item }: { item: any }) => (
        <ThemedView style={[styles.addressCard, { backgroundColor: themeColors.brand.muted }]}>
            <IconSymbol name="house.fill" size={24} color="#fff" style={styles.addressIcon} />
            <ThemedView style={styles.addressContent}>
                <ThemedText style={{ color: '#fff' }}>{item.street}</ThemedText>
                <ThemedText style={{ color: '#rgba(255,255,255,0.7)', fontSize: 12 }}>
                    {item.city}, {item.zip}, {item.country}
                </ThemedText>
            </ThemedView>
        </ThemedView>
    );

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#FF6600', dark: '#1a1f2e' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#ffffff"
                    name="person.fill"
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">My Profile</ThemedText>
            </ThemedView>

            <ThemedView style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>
                <ThemedView style={styles.infoCard}>
                    <ThemedView style={styles.infoRow}>
                        <ThemedText type="defaultSemiBold">Name:</ThemedText>
                        <ThemedText>{user?.firstName} {user?.lastName}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.infoRow}>
                        <ThemedText type="defaultSemiBold">Email:</ThemedText>
                        <ThemedText>{user?.email || 'N/A'}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.infoRow}>
                        <ThemedText type="defaultSemiBold">Phone:</ThemedText>
                        <ThemedText>{user?.phoneNumber || 'N/A'}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Address Book</ThemedText>
                {user?.addresses && user.addresses.length > 0 ? (
                    <FlatList
                        data={user.addresses}
                        renderItem={renderAddressItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                ) : (
                    <ThemedText style={styles.emptyText}>No addresses saved yet.</ThemedText>
                )}
                <TouchableOpacity style={[styles.addButton, { borderColor: themeColors.tint }]}>
                    <ThemedText style={{ color: themeColors.tint }}>+ Add New Address</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <TouchableOpacity
                style={[styles.signOutButton, { backgroundColor: '#ff4444' }]}
                onPress={handleSignOut}
            >
                <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
            </TouchableOpacity>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(150, 150, 150, 0.1)',
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    addressIcon: {
        marginRight: 12,
    },
    addressContent: {
        flex: 1,
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#888',
        marginBottom: 12,
    },
    addButton: {
        padding: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    signOutButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    signOutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
