import { StyleSheet, TouchableOpacity, Image, ScrollView, View, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { PRODUCTS } from '@/constants/dummy-data';
import { ProductCard } from '@/components/ui/product-card';
import { useCart } from '@/hooks/use-cart';
import { AppHeader } from '@/components/app-header';

export default function HomeScreen() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState({ name: 'All', icon: 'square.grid.2x2.fill' });
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const defaultIcon = 'tag.fill';
    const iconMap: Record<string, any> = {
      'Laptops': 'laptopcomputer',
      'Phones': 'smartphone',
      'Accessories': 'headphones',
      'Perfumes': 'drop.fill',
    };

    const uniqueCategories = Array.from(new Set(PRODUCTS.map((p) => p.category)));
    return [
      { name: 'All', icon: 'square.grid.2x2.fill' },
      ...uniqueCategories.map(cat => ({
        name: cat,
        icon: iconMap[cat] || defaultIcon
      }))
    ];
  }, []);

  const filteredProducts = selectedCategory.name === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory.name);



  // Just For You: Mix of products
  const justForYouProducts = filteredProducts.slice(0, 10);

  const onSubmitSearch = () => {
    if (search.trim().length === 0) return;
    router.push(`/explore?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />

      {/* App Header */}
      <AppHeader
        showSearch={true}
        showNotification={true}
        onSearchChange={setSearch}
        searchPlaceholder="Search products..."
      />

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((cat, index) => {
            const isActive = selectedCategory.name === cat.name;
            return (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(cat)}
              >
                <ThemedText style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.name}
                </ThemedText>
                {isActive && <View style={styles.activeLine} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Banner with Free Shipping Tag */}
        <View style={styles.bannerWrapper}>
          <View style={styles.bannerContainer}>
            <Image
              source={require('../../assets/Laptop banner.webp')}
              style={styles.banner}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay}>
              <ThemedText style={styles.bannerTitle}>Welcome to TechMart</ThemedText>
              <View style={styles.freeShippingTag}>
                <ThemedText style={styles.freeShippingText}>FREE SHIPPING</ThemedText>
              </View>
            </View>
          </View>
        </View>



        {/* Infinite Grid Section */}
        <View style={styles.section}>
          <View style={styles.gridHeader}>
            <ThemedText style={styles.gridTitle}>Just For You</ThemedText>
          </View>
          <View style={styles.gridContainer}>
            {justForYouProducts.map((item) => (
              <ProductCard key={item.id} product={item} variant="grid" />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Coupon Button */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryList: {
    gap: 8,
    paddingVertical: 0,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
    height: '100%',
  },
  cameraBtn: {
    padding: 4,
  },
  cartHeaderBtn: {
    position: 'relative',
    padding: 4,
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF4500',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 2,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Category Scroll
  categoryList: {
    paddingHorizontal: 12,
    paddingBottom: 0,
    gap: 16,
  },
  categoryItem: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: '800',
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    backgroundColor: '#FF4500',
    borderRadius: 2,
    alignSelf: 'center',
  },

  // Banner
  bannerWrapper: {
    padding: 12,
  },
  bannerContainer: {
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  banner: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  freeShippingTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  freeShippingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },

  // Flash Sales
  flashSection: {
    marginBottom: 12,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  flashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  flashTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF0000',
    fontStyle: 'italic',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bestsellersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 4,
  },
  bestsellerText: {
    fontSize: 12,
    color: '#FF4500',
    fontWeight: '600',
  },
  seeAll: {
    color: '#666',
    fontSize: 13,
  },

  // Grid
  section: {
    marginBottom: 20,
  },
  gridHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  // Floating Coupon
  floatingCoupon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 100,
  },
  couponInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  couponSubtext: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 8,
  },
});
