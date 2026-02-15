import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      date: '2024-02-10',
      total: 2999.99,
      status: 'Delivered',
      items: 2,
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      date: '2024-02-05',
      total: 499.99,
      status: 'In Transit',
      items: 1,
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      date: '2024-01-28',
      total: 1299.99,
      status: 'Processing',
      items: 1,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#00C896';
      case 'In Transit':
        return '#FF9500';
      case 'Processing':
        return '#0A7AFF';
      default:
        return '#808080';
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'My Orders', headerShown: true }} />

      <ScrollView contentContainerStyle={styles.container}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={[styles.orderCard, { borderColor: '#e0e0e0' }]}
            >
              <View style={styles.orderHeader}>
                <View>
                  <ThemedText type="defaultSemiBold">{order.orderNumber}</ThemedText>
                  <ThemedText style={{ fontSize: 12, marginTop: 4, opacity: 0.6 }}>
                    {order.date}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[
                    styles.statusBadge,
                    { color: getStatusColor(order.status), borderColor: getStatusColor(order.status) },
                  ]}
                >
                  {order.status}
                </ThemedText>
              </View>

              <View style={styles.orderDetail}>
                <View>
                  <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Items</ThemedText>
                  <ThemedText type="defaultSemiBold">{order.items}</ThemedText>
                </View>
                <View>
                  <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Total</ThemedText>
                  <ThemedText type="defaultSemiBold">GH₵{order.total.toFixed(2)}</ThemedText>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <ThemedText style={{ color: '#FF6600' }}>View Details</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="bag" size={48} color="#ccc" />
            <ThemedText style={{ marginTop: 16 }}>No orders yet</ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  orderCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
});
