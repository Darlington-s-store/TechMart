import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handleCheckout = async () => {
        if (!name || !email || !address || !cardNumber) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            clearCart();
            Alert.alert('Success', 'Order placed successfully!', [
                { text: 'OK', onPress: () => router.replace('/') }
            ]);
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <ThemedText>Your cart is empty.</ThemedText>
                    <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn}>
                        <ThemedText style={{ color: '#fff' }}>Go Shopping</ThemedText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Checkout', headerBackTitle: 'Cart' }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Order Summary */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <ThemedText style={styles.summaryLabel}>Subtotal ({items.length} items)</ThemedText>
                            <ThemedText style={styles.summaryValue}>₵{totalPrice.toFixed(2)}</ThemedText>
                        </View>
                        <View style={styles.summaryRow}>
                            <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
                            <ThemedText style={styles.summaryValue}>Free</ThemedText>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <ThemedText style={styles.totalLabel}>Total</ThemedText>
                            <ThemedText style={styles.totalValue}>₵{totalPrice.toFixed(2)}</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Shipping Details */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Shipping Details</ThemedText>
                    <View style={styles.form}>
                        <TextInput
                            placeholder="Full Name"
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="Email Address"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder="Shipping Address"
                            style={[styles.input, styles.textArea]}
                            multiline
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
                    <View style={styles.paymentMethods}>
                        <TouchableOpacity style={[styles.paymentOption, styles.activePayment]}>
                            <IconSymbol name="creditcard.fill" size={20} color="#fff" />
                            <ThemedText style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>Card</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.paymentOption}>
                            <IconSymbol name="banknote.fill" size={20} color="#333" />
                            <ThemedText style={{ color: '#333', fontWeight: '600', marginLeft: 8 }}>Cash</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            placeholder="Cardholder Name"
                            style={styles.input}
                            value={cardName}
                            onChangeText={setCardName}
                        />
                        <TextInput
                            placeholder="Card Number"
                            style={styles.input}
                            keyboardType="numeric"
                            value={cardNumber}
                            onChangeText={setCardNumber}
                        />
                        <View style={styles.rowInputs}>
                            <TextInput
                                placeholder="MM/YY"
                                style={[styles.input, { flex: 1 }]}
                                value={expiry}
                                onChangeText={setExpiry}
                            />
                            <TextInput
                                placeholder="CVV"
                                style={[styles.input, { flex: 1 }]}
                                keyboardType="numeric"
                                value={cvv}
                                onChangeText={setCvv}
                                maxLength={3}
                            />
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.checkoutBtn, loading && styles.disabledBtn]}
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    {loading ? (
                        <ThemedText style={styles.checkoutBtnText}>Processing...</ThemedText>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ThemedText style={styles.checkoutBtnText}>Pay ₵{totalPrice.toFixed(2)}</ThemedText>
                            <IconSymbol name="lock.fill" size={16} color="#fff" style={{ marginLeft: 8 }} />
                        </View>
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
        padding: 20,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtn: {
        marginTop: 20,
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#333',
    },
    summaryBox: {
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#666',
    },
    summaryValue: {
        fontWeight: '600',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FF4500',
    },
    form: {
        gap: 12,
    },
    input: {
        backgroundColor: '#FAFAFA',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        fontSize: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    paymentOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#FAFAFA',
    },
    activePayment: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    checkoutBtn: {
        backgroundColor: '#FF6600',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6600',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    checkoutBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },
});
