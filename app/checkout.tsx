import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart, Order } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Receipt } from '@/components/receipt';

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, totalPrice, createOrder } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'mobile_money'>('card');
    
    // Card payment fields
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    
    // Mobile money fields
    const [phoneNumber, setPhoneNumber] = useState('');
    const [network, setNetwork] = useState<'mtn' | 'vodafone' | 'airteltigo'>('mtn');
    
    // Receipt state
    const [order, setOrder] = useState<Order | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const isCardValid = paymentMethod === 'card' ? (cardName && cardNumber && expiry && cvv) : true;
    const isMobileValid = paymentMethod === 'mobile_money' ? phoneNumber : true;
    const isFormValid = address && isCardValid && isMobileValid;

    const handleCheckout = async () => {
        if (!address) {
            Alert.alert('Error', 'Please enter a delivery address.');
            return;
        }

        if (paymentMethod === 'card' && (!cardName || !cardNumber || !expiry || !cvv)) {
            Alert.alert('Error', 'Please fill in all card details.');
            return;
        }

        if (paymentMethod === 'mobile_money' && !phoneNumber) {
            Alert.alert('Error', 'Please enter your mobile money phone number.');
            return;
        }

        setLoading(true);

        try {
            // Create order
            const newOrder = await createOrder(paymentMethod, address);
            setOrder(newOrder);
            setShowReceipt(true);
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintReceipt = () => {
        Alert.alert('Print Receipt', 'Receipt printing feature would be integrated with native printing APIs.');
    };

    const handleContinueShopping = () => {
        setShowReceipt(false);
        setOrder(null);
        router.replace('/(tabs)');
    };

    // Receipt Modal View
    if (showReceipt && order) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: 'Order Receipt', headerBackTitle: 'Back' }} />
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Receipt order={order} />
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.checkoutBtn, { marginBottom: 8 }]}
                        onPress={handlePrintReceipt}
                    >
                        <IconSymbol name="printer.fill" size={18} color="#fff" style={{ marginRight: 8 }} />
                        <ThemedText style={styles.checkoutBtnText}>Print Receipt</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.checkoutBtn, { backgroundColor: '#666' }]}
                        onPress={handleContinueShopping}
                    >
                        <ThemedText style={styles.checkoutBtnText}>Continue Shopping</ThemedText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <ThemedText>Your cart is empty.</ThemedText>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
                        <ThemedText style={{ color: '#fff' }}>Go Shopping</ThemedText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    const subtotal = totalPrice;
    const tax = subtotal * 0.05;
    const finalTotal = subtotal + tax;

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
                            <ThemedText style={styles.summaryValue}>₵{subtotal.toFixed(2)}</ThemedText>
                        </View>
                        <View style={styles.summaryRow}>
                            <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
                            <ThemedText style={styles.summaryValue}>Free</ThemedText>
                        </View>
                        <View style={styles.summaryRow}>
                            <ThemedText style={styles.summaryLabel}>Tax (5%)</ThemedText>
                            <ThemedText style={styles.summaryValue}>₵{tax.toFixed(2)}</ThemedText>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <ThemedText style={styles.totalLabel}>Total</ThemedText>
                            <ThemedText style={styles.totalValue}>₵{finalTotal.toFixed(2)}</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Delivery Address</ThemedText>
                    <View style={styles.form}>
                        <TextInput
                            placeholder="Enter your full delivery address"
                            style={[styles.input, styles.textArea]}
                            multiline
                            numberOfLines={4}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                </View>

                {/* Payment Method Selection */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
                    <View style={styles.paymentMethods}>
                        <TouchableOpacity 
                            style={[styles.paymentOption, paymentMethod === 'card' && styles.activePayment]}
                            onPress={() => setPaymentMethod('card')}
                        >
                            <IconSymbol name="creditcard.fill" size={20} color={paymentMethod === 'card' ? '#fff' : '#333'} />
                            <ThemedText style={{ color: paymentMethod === 'card' ? '#fff' : '#333', fontWeight: '600', marginLeft: 8 }}>Card</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.paymentOption, paymentMethod === 'mobile_money' && styles.activePayment]}
                            onPress={() => setPaymentMethod('mobile_money')}
                        >
                            <IconSymbol name="phone.fill" size={20} color={paymentMethod === 'mobile_money' ? '#fff' : '#333'} />
                            <ThemedText style={{ color: paymentMethod === 'mobile_money' ? '#fff' : '#333', fontWeight: '600', marginLeft: 8 }}>Mobile Money</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.paymentOption, paymentMethod === 'cash' && styles.activePayment]}
                            onPress={() => setPaymentMethod('cash')}
                        >
                            <IconSymbol name="banknote.fill" size={20} color={paymentMethod === 'cash' ? '#fff' : '#333'} />
                            <ThemedText style={{ color: paymentMethod === 'cash' ? '#fff' : '#333', fontWeight: '600', marginLeft: 8 }}>Cash on Delivery</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Card Details</ThemedText>
                        <View style={styles.form}>
                            <TextInput
                                placeholder="Cardholder Name"
                                style={styles.input}
                                value={cardName}
                                onChangeText={setCardName}
                            />
                            <TextInput
                                placeholder="Card Number (16 digits)"
                                style={styles.input}
                                keyboardType="numeric"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                maxLength={16}
                            />
                            <View style={styles.rowInputs}>
                                <TextInput
                                    placeholder="MM/YY"
                                    style={[styles.input, { flex: 1 }]}
                                    value={expiry}
                                    onChangeText={setExpiry}
                                    maxLength={5}
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
                )}

                {/* Mobile Money Form */}
                {paymentMethod === 'mobile_money' && (
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Mobile Money Details</ThemedText>
                        <View style={styles.form}>
                            <View style={styles.networkSelector}>
                                {(['mtn', 'vodafone', 'airteltigo'] as const).map((net) => (
                                    <TouchableOpacity
                                        key={net}
                                        style={[styles.networkBtn, network === net && styles.activeNetwork]}
                                        onPress={() => setNetwork(net)}
                                    >
                                        <ThemedText style={{ color: network === net ? '#fff' : '#333', fontWeight: '600' }}>
                                            {net.toUpperCase()}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                placeholder="Mobile Money Number (024XXXXXXX)"
                                style={styles.input}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>
                    </View>
                )}

                {/* Cash on Delivery Info */}
                {paymentMethod === 'cash' && (
                    <View style={styles.section}>
                        <View style={styles.codInfo}>
                            <IconSymbol name="info.circle.fill" size={20} color="#FF6600" />
                            <ThemedText style={{ marginLeft: 12, flex: 1, color: '#333', lineHeight: 18 }}>
                                You will pay ₵{finalTotal.toFixed(2)} when your order is delivered.
                            </ThemedText>
                        </View>
                    </View>
                )}

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.checkoutBtn, loading && styles.disabledBtn]}
                    onPress={handleCheckout}
                    disabled={loading || !isFormValid}
                >
                    {loading ? (
                        <ThemedText style={styles.checkoutBtnText}>Processing...</ThemedText>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ThemedText style={styles.checkoutBtnText}>Complete Order</ThemedText>
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
        color: '#FF6600',
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
        height: 100,
        textAlignVertical: 'top',
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    paymentOption: {
        flex: 1,
        minWidth: '31%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    activePayment: {
        backgroundColor: '#FF6600',
        borderColor: '#FF6600',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    networkSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    networkBtn: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    activeNetwork: {
        backgroundColor: '#FF6600',
        borderColor: '#FF6600',
    },
    codInfo: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF5F0',
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6600',
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
        gap: 8,
    },
    checkoutBtn: {
        backgroundColor: '#FF6600',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
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
