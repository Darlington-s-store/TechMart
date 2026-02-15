import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/hooks/use-cart';

interface AppHeaderProps {
  showSearch?: boolean;
  showNotification?: boolean;
  title?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
}

export function AppHeader({
  showSearch = false,
  showNotification = true,
  title,
  onSearchChange,
  searchPlaceholder = 'Search...',
}: AppHeaderProps) {
  const router = useRouter();
  const { totalItems } = useCart();
  const [searchText, setSearchText] = useState('');
  const [notificationCount] = useState(3); // Placeholder notification count

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  return (
    <View style={styles.container}>
      {/* Logo / Title Section */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => router.push('/(tabs)')}
        >
          <View style={styles.logoCircle}>
            <ThemedText style={styles.logoText}>T</ThemedText>
          </View>
        </TouchableOpacity>
        {title && <ThemedText style={styles.title}>{title}</ThemedText>}
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <IconSymbol
            name="magnifyingglass"
            size={16}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearchChange}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <IconSymbol name="xmark.circle.fill" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Right Actions */}
      <View style={styles.rightSection}>
        {showNotification && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <IconSymbol name="bell.fill" size={20} color="#333" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <ThemedText style={styles.badgeText}>
                  {notificationCount}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    minWidth: 100,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    position: 'relative',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});
