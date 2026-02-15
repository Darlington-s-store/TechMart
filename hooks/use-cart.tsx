import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './use-auth';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: ImageSourcePropType;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  paymentMethod: 'cash' | 'card' | 'mobile_money';
  deliveryAddress: string;
  createdAt: string;
  receipt?: {
    receiptNumber: string;
    timestamp: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
  };
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  createOrder: (paymentMethod: string, deliveryAddress: string) => Promise<Order>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from AsyncStorage on mount or user change
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setItems([]);
        return;
      }
      try {
        const cartData = await AsyncStorage.getItem(`cart-${user.id}`);
        if (cartData) {
          setItems(JSON.parse(cartData));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setItems([]);
      }
    };
    loadCart();
  }, [user]);

  // Save cart to AsyncStorage whenever items change
  useEffect(() => {
    const saveCart = async () => {
      if (!user) return;
      try {
        await AsyncStorage.setItem(`cart-${user.id}`, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };
    saveCart();
  }, [items, user]);

  const addToCart = (item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const createOrder = async (paymentMethod: string, deliveryAddress: string): Promise<Order> => {
    if (!user) throw new Error('User not authenticated');
    if (items.length === 0) throw new Error('Cart is empty');

    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    const order: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      total,
      status: 'Processing',
      items: [...items],
      paymentMethod: paymentMethod as 'cash' | 'card' | 'mobile_money',
      deliveryAddress,
      createdAt: new Date().toISOString(),
      receipt: {
        receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        items: [...items],
        subtotal,
        tax,
        total,
      },
    };

    // Save order to user's orders
    const ordersData = await AsyncStorage.getItem(`orders-${user.id}`);
    const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
    orders.push(order);
    await AsyncStorage.setItem(`orders-${user.id}`, JSON.stringify(orders));

    // Clear cart
    clearCart();

    return order;
  };

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items]);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const ordersData = await AsyncStorage.getItem(`orders-${user.id}`);
        setOrders(ordersData ? JSON.parse(ordersData) : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return { orders, loading };
}
