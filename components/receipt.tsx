import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Order } from '@/hooks/use-cart';

interface ReceiptProps {
  order: Order;
}

export const Receipt: React.FC<ReceiptProps> = ({ order }) => {
  const paymentMethodLabels: Record<string, string> = {
    card: 'Credit/Debit Card',
    cash: 'Cash on Delivery',
    mobile_money: 'Mobile Money',
  };

  const subtotal = order.receipt?.subtotal ?? order.items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = order.receipt?.tax ?? subtotal * 0.05;
  const total = order.receipt?.total ?? subtotal + tax;

  return (
    <View style={styles.receipt}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.storeName}>TechMart Store</Text>
        <Text style={styles.receiptLabel}>RECEIPT</Text>
      </View>

      <View style={styles.divider} />

      {/* Receipt & Order Info */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Receipt #</Text>
          <Text style={styles.value}>{order.receipt?.receiptNumber || `RCP-${Date.now().toString().slice(-6)}`}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Order #</Text>
          <Text style={styles.value}>{order.orderNumber}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{order.date}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Items */}
      <View style={styles.itemsSection}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemName, { flex: 2 }]}>Item</Text>
          <Text style={[styles.itemText, { flex: 1 }]}>Qty</Text>
          <Text style={[styles.itemText, { flex: 1 }]}>Price</Text>
          <Text style={[styles.itemText, { flex: 1, textAlign: 'right' }]}>Total</Text>
        </View>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={[styles.itemName, { flex: 2 }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.itemText, { flex: 1 }]}>{item.qty}</Text>
            <Text style={[styles.itemText, { flex: 1 }]}>₵{item.price.toFixed(2)}</Text>
            <Text style={[styles.itemText, { flex: 1, textAlign: 'right' }]}>
              ₵{(item.qty * item.price).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>₵{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.label}>Tax (5%):</Text>
          <Text style={styles.value}>₵{tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.grandTotalLabel}>TOTAL:</Text>
          <Text style={styles.grandTotalValue}>₵{total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Payment & Shipping Info */}
      <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{paymentMethodLabels[order.paymentMethod]}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Delivery Address:</Text>
          <Text style={[styles.value, { fontSize: 11 }]}>{order.deliveryAddress}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for your purchase!</Text>
        <Text style={styles.footerText}>Please keep this receipt for your records.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  receipt: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  receiptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  itemsSection: {
    marginVertical: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  itemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  totalsSection: {
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6600',
  },
  detailsSection: {
    marginVertical: 8,
  },
  detailItem: {
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
});
