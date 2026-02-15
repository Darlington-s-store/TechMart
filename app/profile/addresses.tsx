import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth, Address } from '@/hooks/use-auth';

export default function AddressesScreen() {
    const router = useRouter();
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('Ghana');

    const addresses = user?.addresses || [];
    const isFormValid = street.trim() && city.trim() && zip.trim() && country.trim();

    const handleAddAddress = async () => {
        if (!isFormValid) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const newAddress: Address = {
                id: `addr-${Date.now()}`,
                street,
                city,
                zip,
                country,
                isDefault: addresses.length === 0,
            };

            const updatedAddresses = [...addresses, newAddress];
            await updateProfile({ addresses: updatedAddresses });

            // Reset form
            setStreet('');
            setCity('');
            setZip('');
            setCountry('Ghana');
            setShowAddForm(false);
            Alert.alert('Success', 'Address added successfully');
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = (id: string) => {
        Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    setLoading(true);
                    try {
                        const updatedAddresses = addresses.filter((a) => a.id !== id);
                        // If deleted address was default, make first one default
                        if (updatedAddresses.length > 0 && addresses.find((a) => a.id === id && a.isDefault)) {
                            updatedAddresses[0].isDefault = true;
                        }
                        await updateProfile({ addresses: updatedAddresses });
                        Alert.alert('Success', 'Address deleted');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete address');
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    const handleSetDefault = async (id: string) => {
        setLoading(true);
        try {
            const updatedAddresses = addresses.map((a) => ({
                ...a,
                isDefault: a.id === id,
            }));
            await updateProfile({ addresses: updatedAddresses });
            Alert.alert('Success', 'Default address updated');
        } catch (error) {
            Alert.alert('Error', 'Failed to update default address');
        } finally {
            setLoading(false);
        }
    };

    const renderAddressItem = ({ item }: { item: Address; index: number }) => (
        <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
                <View style={styles.addressMain}>
                    <ThemedText style={styles.addressStreet}>{item.street}</ThemedText>
                    <ThemedText style={styles.addressDetails}>
                        {item.city}, {item.zip}, {item.country}
                    </ThemedText>
                </View>
                {item.isDefault && (
                    <View style={styles.defaultBadge}>
                        <ThemedText style={styles.defaultBadgeText}>Default</ThemedText>
                    </View>
                )}
            </View>

            <View style={styles.addressActions}>
                {!item.isDefault && (
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleSetDefault(item.id)}
                        disabled={loading}
                    >
                        <IconSymbol name="checkmark.circle" size={18} color="#0A7AFF" />
                        <ThemedText style={styles.actionBtnText}>Set Default</ThemedText>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtnAction]}
                    onPress={() => handleDeleteAddress(item.id)}
                    disabled={loading}
                >
                    <IconSymbol name="trash" size={18} color="#FF3B30" />
                    <ThemedText style={[styles.actionBtnText, styles.deleteBtnText]}>Delete</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ title: 'My Addresses' }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Add Address Form */}
                {showAddForm && (
                    <View style={styles.formCard}>
                        <ThemedText style={styles.formTitle}>Add New Address</ThemedText>

                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Street Address</ThemedText>
                            <TextInput
                                style={styles.input}
                                value={street}
                                onChangeText={setStreet}
                                placeholder="Enter street address"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>City</ThemedText>
                            <TextInput
                                style={styles.input}
                                value={city}
                                onChangeText={setCity}
                                placeholder="Enter city"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Zip Code</ThemedText>
                            <TextInput
                                style={styles.input}
                                value={zip}
                                onChangeText={setZip}
                                placeholder="Enter zip code"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Country</ThemedText>
                            <TextInput
                                style={styles.input}
                                value={country}
                                onChangeText={setCountry}
                                placeholder="Enter country"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.formActions}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelBtn]}
                                onPress={() => setShowAddForm(false)}
                                disabled={loading}
                            >
                                <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addBtn, loading && styles.disabledBtn]}
                                onPress={handleAddAddress}
                                disabled={loading || !isFormValid}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <ThemedText style={styles.addBtnText}>Add Address</ThemedText>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Addresses List */}
                {addresses.length > 0 ? (
                    <>
                        <ThemedText style={styles.sectionTitle}>
                            Your Addresses ({addresses.length})
                        </ThemedText>
                        <FlatList
                            data={addresses}
                            renderItem={renderAddressItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.addressesList}
                        />
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <IconSymbol name="location.slash" size={48} color="#ccc" />
                        <ThemedText style={styles.emptyStateText}>No addresses saved yet</ThemedText>
                    </View>
                )}
            </ScrollView>

            {/* Add Address Button */}
            <View style={styles.footer}>
                {!showAddForm && (
                    <TouchableOpacity
                        style={[styles.addAddressBtn, loading && styles.disabledBtn]}
                        onPress={() => setShowAddForm(true)}
                        disabled={loading}
                    >
                        <IconSymbol name="plus.circle.fill" size={18} color="#fff" />
                        <ThemedText style={styles.addAddressBtnText}>Add New Address</ThemedText>
                    </TouchableOpacity>
                )}
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    formCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#eee',
    },
    formTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
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
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        color: '#000',
    },
    formActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    addressesList: {
        gap: 12,
        paddingBottom: 20,
    },
    addressCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#eee',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    addressMain: {
        flex: 1,
    },
    addressStreet: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    addressDetails: {
        fontSize: 12,
        color: '#666',
    },
    defaultBadge: {
        backgroundColor: '#0A7AFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 8,
    },
    defaultBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    addressActions: {
        flexDirection: 'row',
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        gap: 6,
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0A7AFF',
    },
    deleteBtnAction: {
        borderColor: '#FF3B30',
    },
    deleteBtnText: {
        color: '#FF3B30',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
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
    addBtn: {
        backgroundColor: '#FF6600',
    },
    addBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    addAddressBtn: {
        backgroundColor: '#FF6600',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        gap: 8,
    },
    addAddressBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#999',
        marginTop: 12,
    },
    disabledBtn: {
        opacity: 0.6,
    },
});
