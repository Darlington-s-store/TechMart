import { View, StyleSheet, TouchableOpacity, FlatList, Platform, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';

export default function CartScreen() {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { userToken } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!userToken) {
      router.replace('/auth');
    }
  }, [userToken, router]);

  if (!userToken) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>Redirecting to login...</ThemedText>
      </View>
    );
  }

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.itemImage} contentFit="contain" />
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <ThemedText style={styles.itemName} numberOfLines={2}>{item.name}</ThemedText>
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
            <IconSymbol name="trash" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.itemPrice}>₵{item.price.toFixed(2)}</ThemedText>

        <View style={styles.actionRow}>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.id, item.qty - 1)}
            >
              <IconSymbol name="minus" size={14} color="#333" />
            </TouchableOpacity>

            <ThemedText style={styles.qtyText}>{item.qty}</ThemedText>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.id, item.qty + 1)}
            >
              <IconSymbol name="plus" size={14} color="#333" />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.itemTotal}>
            Total: ₵{(item.price * item.qty).toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Cart</ThemedText>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <ThemedText style={styles.clearText}>Clear All</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <IconSymbol name="cart" size={64} color="#ccc" />
            </View>
            <ThemedText style={styles.emptyTitle}>Your Cart is Empty</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Looks like you haven&apos;t added anything to your cart yet.
            </ThemedText>
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => router.push('/explore')}
            >
              <ThemedText style={styles.shopNowText}>Start Shopping</ThemedText>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Checkout Section */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.summaryValue}>₵{totalPrice.toFixed(2)}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
            <ThemedText style={styles.summaryValue}>Free</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>₵{totalPrice.toFixed(2)}</ThemedText>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
            <ThemedText style={styles.checkoutText}>Proceed to Checkout</ThemedText>
            <IconSymbol name="arrow.right" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
  clearText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 200, // Space for footer
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  removeBtn: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6600',
    marginTop: 4,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 16,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  shopNowBtn: {
    backgroundColor: '#FF6600',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shopNowText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF6600',
  },
  checkoutBtn: {
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
