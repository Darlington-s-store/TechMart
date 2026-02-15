import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useOrders } from '@/hooks/use-cart';

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { orders, loading } = useOrders();
  const router = useRouter();

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

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={themeColors.brand.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'My Orders', headerShown: true }} />

      <ScrollView contentContainerStyle={styles.container}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={[styles.orderCard, { borderColor: '#e0e0e0' }]}
              onPress={() => router.push(`/order-details/${order.id}`)}
            >
              <View style={styles.orderHeader}>
                <View>
                  <ThemedText type="defaultSemiBold">{order.orderNumber}</ThemedText>
                  <ThemedText style={{ fontSize: 12, marginTop: 4, opacity: 0.6 }}>
                    {new Date(order.date).toLocaleDateString()}
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
                  <ThemedText type="defaultSemiBold">{order.items.length}</ThemedText>
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
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <ThemedText style={{ color: '#FF6600', fontWeight: '600' }}>Start Shopping</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
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
  shopButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6600',
  },
});
