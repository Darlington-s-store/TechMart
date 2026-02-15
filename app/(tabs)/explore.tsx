import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  LayoutAnimation,
  UIManager,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PRODUCTS } from '@/constants/dummy-data';
import { ProductCard } from '@/components/ui/product-card';
import { AppHeader } from '@/components/app-header';


if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 90;

export default function ExploreScreen() {


  const [selectedCategory, setSelectedCategory] = useState<string>('Laptops');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu Modal State
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current; // Start hidden left

  // 1. Extract Categories, Subcategories, and Brands from Data
  const dataMap = useMemo(() => {
    const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));

    // Create a map for quick lookup of subs/brands per category
    const map: Record<string, { subcategories: string[]; brands: string[] }> = {};

    categories.forEach(cat => {
      const productsInCat = PRODUCTS.filter(p => p.category === cat);
      const subs = Array.from(new Set(productsInCat.map(p => p.subcategory)));
      const brands = Array.from(new Set(productsInCat.map(p => p.brand)));
      map[cat] = { subcategories: subs, brands: brands };
    });

    return { categories, map };
  }, []);

  // 2. Filter Products based on selection
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedSubcategory, selectedBrand, searchQuery]);

  // Handle Category Change
  const handleCategoryPress = (category: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedBrand(null);
  };

  // Open/Close Menu Logic
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.8,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const handleMenuSelect = (type: 'subcategory' | 'brand', value: string) => {
    if (type === 'subcategory') {
      setSelectedSubcategory(value === selectedSubcategory ? null : value);
    } else {
      setSelectedBrand(value === selectedBrand ? null : value);
    }
    closeMenu();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedSubcategory) count++;
    if (selectedBrand) count++;
    return count;
  };

  const resetFilters = () => {
    setSelectedSubcategory(null);
    setSelectedBrand(null);
  }

  // --- Render Functions ---

  const renderSidebarItem = (cat: string) => {
    const isActive = selectedCategory === cat;
    return (
      <TouchableOpacity
        key={cat}
        style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
        onPress={() => handleCategoryPress(cat)}
        activeOpacity={0.8}
      >
        {isActive && <View style={styles.activeLine} />}
        <View style={styles.sidebarIconContainer}>
          {/* Placeholder icons based on category names for visual polish */}
          <IconSymbol
            name={
              cat === 'Laptops' ? 'laptopcomputer' :
                cat === 'Phones' ? 'smartphone' :
                  cat === 'Accessories' ? 'headphones' :
                    'tag'
            }
            size={20}
            color={isActive ? '#FF6600' : '#666'}
          />
        </View>
        <ThemedText
          style={[
            styles.sidebarText,
            isActive && styles.sidebarTextActive,
            { color: isActive ? '#FF6600' : '#555' }
          ]}
          numberOfLines={1}
        >
          {cat}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* 1. Top Header */}
      <AppHeader
        showSearch={true}
        showNotification={true}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search products..."
      />

      <View style={styles.contentContainer}>

        {/* 2. Narrow Left Sidebar */}
        <View style={styles.sidebar}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sidebarContent}
          >
            {dataMap.categories.map(renderSidebarItem)}
          </ScrollView>
        </View>

        {/* 3. Main Content Area */}
        <View style={styles.mainContent}>

          {/* Filter Toggle Bar */}
          <View style={styles.filterBar}>
            <TouchableOpacity style={styles.menuTriggerBtn} onPress={openMenu}>
              <IconSymbol name="line.3.horizontal.decrease" size={16} color="#333" />
              <ThemedText style={styles.menuTriggerText}>Filter & Brands</ThemedText>
              {getActiveFilterCount() > 0 && (
                <View style={styles.filterCountBadge}>
                  <ThemedText style={styles.filterCountText}>{getActiveFilterCount()}</ThemedText>
                </View>
              )}
            </TouchableOpacity>

            {/* Active Filter Chips (if any) */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFiltersScroll}>
              {selectedSubcategory && (
                <TouchableOpacity style={styles.activeChip} onPress={() => setSelectedSubcategory(null)}>
                  <ThemedText style={styles.activeChipText}>{selectedSubcategory}</ThemedText>
                  <IconSymbol name="xmark" size={10} color="#fff" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              )}
              {selectedBrand && (
                <TouchableOpacity style={[styles.activeChip, { backgroundColor: '#333' }]} onPress={() => setSelectedBrand(null)}>
                  <ThemedText style={styles.activeChipText}>{selectedBrand}</ThemedText>
                  <IconSymbol name="xmark" size={10} color="#fff" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Products Grid */}
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <View style={styles.gridItemWrapper}>
                <ProductCard product={item} variant="grid" style={styles.productCard} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={48} color="#ccc" />
                <ThemedText style={styles.emptyText}>No products found</ThemedText>
                <TouchableOpacity onPress={resetFilters}>
                  <ThemedText style={styles.resetText}>Clear Filters</ThemedText>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>

      {/* 4. Sliding Menu Drawer */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeMenu} activeOpacity={1} />

          <Animated.View
            style={[
              styles.menuDrawer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
              <View style={styles.menuHeader}>
                <ThemedText style={styles.menuTitle}>{selectedCategory}</ThemedText>
                <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                  <IconSymbol name="xmark" size={20} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuContent}>

                {/* Subcategories Section */}
                <View style={styles.menuSection}>
                  <ThemedText style={styles.menuSectionTitle}>Subcategories</ThemedText>
                  <View style={styles.chipsWrap}>
                    {dataMap.map[selectedCategory]?.subcategories.map((sub) => {
                      const isSelected = selectedSubcategory === sub;
                      return (
                        <TouchableOpacity
                          key={sub}
                          style={[styles.menuChip, isSelected && styles.menuChipActive]}
                          onPress={() => handleMenuSelect('subcategory', sub)}
                        >
                          <ThemedText style={[styles.menuChipText, isSelected && styles.menuChipTextActive]}>
                            {sub}
                          </ThemedText>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>

                <View style={styles.menuDivider} />

                {/* Brands Section */}
                <View style={styles.menuSection}>
                  <ThemedText style={styles.menuSectionTitle}>Brands</ThemedText>
                  <View style={styles.chipsWrap}>
                    {dataMap.map[selectedCategory]?.brands.map((brand) => {
                      const isSelected = selectedBrand === brand;
                      return (
                        <TouchableOpacity
                          key={brand}
                          style={[styles.menuChip, isSelected && styles.menuChipActive]}
                          onPress={() => handleMenuSelect('brand', brand)}
                        >
                          <ThemedText style={[styles.menuChipText, isSelected && styles.menuChipTextActive]}>
                            {brand}
                          </ThemedText>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Actions */}
              <View style={styles.menuFooter}>
                <TouchableOpacity style={styles.showResultsBtn} onPress={closeMenu}>
                  <ThemedText style={styles.showResultsText}>Show {filteredProducts.length} Results</ThemedText>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  cartButton: { padding: 4 },

  // Layout
  contentContainer: { flex: 1, flexDirection: 'row' },

  // Sidebar (Narrow)
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fafafa',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  sidebarContent: { paddingVertical: 10 },
  sidebarItem: {
    height: 70, // Taller for icon + text
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    position: 'relative',
    marginBottom: 4,
  },
  sidebarItemActive: { backgroundColor: '#fff' },
  activeLine: {
    position: 'absolute',
    left: 0,
    top: 15,
    bottom: 15,
    width: 3,
    backgroundColor: '#FF6600',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  sidebarIconContainer: {
    marginBottom: 4,
  },
  sidebarText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  sidebarTextActive: { fontWeight: '700', fontSize: 10 },

  // Main Content
  mainContent: { flex: 1, backgroundColor: '#fff' },

  // Filter Bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    gap: 10,
  },
  menuTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  menuTriggerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  filterCountBadge: {
    backgroundColor: '#FF6600',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCountText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  activeFiltersScroll: { alignItems: 'center', gap: 8 },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeChipText: { color: '#fff', fontSize: 10, fontWeight: '600' },

  // Products
  productList: { padding: 12, paddingBottom: 50 },
  gridItemWrapper: { width: '48%', marginBottom: 0 },
  productCard: { width: '100%' },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  emptyText: { color: '#999', fontSize: 16 },
  resetText: { color: '#FF6600', fontSize: 14, fontWeight: '600' },

  // Menu Drawer
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuDrawer: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuTitle: { fontSize: 18, fontWeight: '800' },
  closeBtn: { padding: 4 },
  menuContent: { padding: 16 },
  menuSection: { marginBottom: 20 },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 12
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menuChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  menuChipActive: {
    backgroundColor: '#FF6600', // Changed to solid color for clarity
    borderColor: '#FF6600',
  },
  menuChipText: { fontSize: 13, color: '#333' },
  menuChipTextActive: { color: '#fff', fontWeight: 'bold' },

  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  menuFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  showResultsBtn: {
    backgroundColor: '#000',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showResultsText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
