import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/use-auth';
import { Order } from '@/hooks/use-cart';
import { Receipt } from '@/components/receipt';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!user || !id) return;
      try {
        const ordersData = await AsyncStorage.getItem(`orders-${user.id}`);
        const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
        const foundOrder = orders.find((o) => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          Alert.alert('Error', 'Order not found');
          router.back();
        }
      } catch (error) {
        console.error('Error loading order:', error);
        Alert.alert('Error', 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#00C896';
      case 'In Transit':
        return '#FF9500';
      case 'Processing':
        return '#0A7AFF';
      case 'Cancelled':
        return '#FF3B30';
      default:
        return '#808080';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'checkmark.circle.fill';
      case 'In Transit':
        return 'cube.transparent';
      case 'Processing':
        return 'hourglass';
      case 'Cancelled':
        return 'xmark.circle.fill';
      default:
        return 'questionmark.circle.fill';
    }
  };

  const handlePrintReceipt = () => {
    Alert.alert('Print Receipt', 'Receipt printing feature would be integrated with native printing APIs.');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6600" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ThemedText>Order not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const paymentMethodLabels: Record<string, string> = {
    card: 'Credit/Debit Card',
    cash: 'Cash on Delivery',
    mobile_money: 'Mobile Money',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Order Details' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View>
              <ThemedText style={styles.orderNumber}>{order.orderNumber}</ThemedText>
              <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.status) + '20', borderColor: getStatusColor(order.status) },
              ]}
            >
              <IconSymbol name={getStatusIcon(order.status) as any} size={20} color={getStatusColor(order.status)} />
              <ThemedText style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Order Items ({order.items.length})</ThemedText>
          <View style={styles.itemsList}>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                  <ThemedText style={styles.itemPrice}>₵{item.price.toFixed(2)}</ThemedText>
                </View>
                <View style={styles.itemQty}>
                  <ThemedText style={styles.qty}>x{item.qty}</ThemedText>
                  <ThemedText style={styles.itemTotal}>₵{(item.qty * item.price).toFixed(2)}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
          <View style={styles.summaryBox}>
            {(() => {
              const subtotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
              const tax = subtotal * 0.05;
              return (
                <>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.label}>Subtotal</ThemedText>
                    <ThemedText style={styles.value}>₵{subtotal.toFixed(2)}</ThemedText>
                  </View>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.label}>Tax (5%)</ThemedText>
                    <ThemedText style={styles.value}>₵{tax.toFixed(2)}</ThemedText>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.summaryRow}>
                    <ThemedText style={[styles.label, styles.totalLabel]}>Total</ThemedText>
                    <ThemedText style={[styles.value, styles.totalValue]}>₵{order.total.toFixed(2)}</ThemedText>
                  </View>
                </>
              );
            })()}
          </View>
        </View>

        {/* Delivery & Payment Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Delivery & Payment</ThemedText>
          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <IconSymbol name="mappin.circle.fill" size={24} color="#FF6600" />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Delivery Address</ThemedText>
                <ThemedText style={styles.infoValue}>{order.deliveryAddress}</ThemedText>
              </View>
            </View>
            <View style={[styles.infoItem, styles.infoItemMargin]}>
              <IconSymbol name="creditcard.circle.fill" size={24} color="#FF6600" />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Payment Method</ThemedText>
                <ThemedText style={styles.infoValue}>{paymentMethodLabels[order.paymentMethod]}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Receipt Button */}
        <TouchableOpacity
          style={styles.receiptButton}
          onPress={() => setShowReceipt(true)}
        >
          <IconSymbol name="doc.text.fill" size={18} color="#fff" />
          <ThemedText style={styles.receiptButtonText}>View Receipt</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Receipt Modal */}
      <Modal visible={showReceipt} transparent animationType="slide">
        <SafeAreaView style={styles.container}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReceipt(false)}>
              <IconSymbol name="xmark" size={24} color="#000" />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Receipt</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView contentContainerStyle={styles.receiptScroll} showsVerticalScrollIndicator={false}>
            <Receipt order={order} />
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.printBtn} onPress={handlePrintReceipt}>
              <IconSymbol name="printer.fill" size={18} color="#fff" />
              <ThemedText style={styles.printBtnText}>Print Receipt</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.printBtn, { backgroundColor: '#666' }]}
              onPress={() => setShowReceipt(false)}
            >
              <ThemedText style={styles.printBtnText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    backgroundColor: '#FFF5F0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6600',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  itemsList: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemRow_last: {
    borderBottomWidth: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
  },
  itemQty: {
    alignItems: 'flex-end',
  },
  qty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6600',
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
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalLabel: {
    fontWeight: '700',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    color: '#FF6600',
  },
  infoBox: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    gap: 12,
  },
  infoItemMargin: {
    marginTop: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  receiptButton: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  receiptButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  receiptScroll: {
    padding: 16,
    flexGrow: 1,
  },
  modalFooter: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  printBtn: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  printBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
