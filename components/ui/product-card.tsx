import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View, ViewStyle, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Product } from '@/constants/dummy-data';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
    product: Product;
    variant?: 'grid' | 'horizontal';
    style?: ViewStyle;
}

export function ProductCard({ product, variant = 'grid', style }: ProductCardProps) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { addToCart } = useCart();

    const themeColors = Colors[colorScheme ?? 'light'];

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            image: product.image,
        });
    };


    const onPress = () => {
        router.push({ pathname: '/product/[id]', params: { id: product.id } });
    };



    // --- HORIZONTAL VARIANT (Flash Sales) ---
    if (variant === 'horizontal') {
        const stockPercent = product.stock ? Math.min(Math.max((product.stock / 50) * 100, 10), 90) : 65;

        return (
            <TouchableOpacity
                style={[styles.horizontalCard, { backgroundColor: themeColors.background }, style]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <View style={styles.horizontalImageContainer}>
                    <Image
                        source={product.image}
                        style={styles.horizontalImage}
                        contentFit="contain"
                        transition={300}
                    />

                </View>
                <View style={styles.horizontalContent}>
                    <ThemedText numberOfLines={1} style={styles.brandText}>{product.brand}</ThemedText>
                    <ThemedText numberOfLines={2} style={styles.nameHorizontal}>{product.name}</ThemedText>

                    <View style={styles.priceRow}>
                        <ThemedText style={styles.price}>₵{product.discountPrice || product.price}</ThemedText>

                    </View>

                    {/* Stock Progress Bar */}
                    <View style={styles.stockBarContainer}>
                        <View style={[styles.stockBarFill, { width: `${stockPercent}%` }]} />
                        <ThemedText style={styles.stockText}>{product.stock < 10 ? `Only ${product.stock} left` : 'Selling Fast'}</ThemedText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // --- GRID VARIANT (Default) ---
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: themeColors.background }, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={product.image}
                    style={styles.image}
                    contentFit="contain"
                    transition={300}
                />

                {/* Wishlist Button (Top Right) */}
                <TouchableOpacity style={styles.wishlistBtn}>
                    <IconSymbol name="heart" size={16} color="#666" />
                </TouchableOpacity>


            </View>

            <View style={styles.content}>
                {/* Brand */}
                <ThemedText style={styles.brandText} numberOfLines={1}>{product.brand}</ThemedText>

                {/* Name */}
                <ThemedText numberOfLines={2} style={styles.name}>{product.name}</ThemedText>

                {/* Rating */}
                <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                        <IconSymbol name="star.fill" size={10} color="#FFD700" />
                    </View>
                    <ThemedText style={styles.ratingText}>{product.rating}</ThemedText>
                    <ThemedText style={styles.reviewCount}>({product.reviews})</ThemedText>
                </View>

                {/* Price & Action */}
                <View style={styles.bottomRow}>
                    <View style={styles.priceContainer}>
                        <ThemedText style={styles.price}>₵{product.discountPrice || product.price}</ThemedText>
                    </View>

                    <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
                        <IconSymbol name="plus" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // --- Grid Styles ---
    card: {
        width: '48%',
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        // Shadow / Elevation
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
            }
        }),
    },
    imageContainer: {
        height: 160,
        backgroundColor: '#fff', // White background for product images looks cleaner
        position: 'relative',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    wishlistBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: Colors.light.brand.sale,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        padding: 10,
        paddingTop: 8,
    },
    brandText: {
        fontSize: 10,
        color: '#888',
        fontWeight: '600',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    name: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
        marginBottom: 6,
        height: 34, // Fixed height for 2 lines
        lineHeight: 17,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 2,
    },
    stars: {
        flexDirection: 'row',
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#333',
        marginLeft: 2,
    },
    reviewCount: {
        fontSize: 10,
        color: '#999',
    },

    // Bottom Row (Price + Button)
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    priceContainer: {
        flex: 1,
    },
    price: {
        fontSize: 15,
        fontWeight: '800',
        color: Colors.light.brand.primary,
    },
    discountPrice: {
        fontSize: 10,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    cartBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#000', // Black button for premium feel
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- Horizontal Styles ---
    horizontalCard: {
        width: 150,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    horizontalImageContainer: {
        height: 120,
        backgroundColor: '#fafafa',
        position: 'relative',
        padding: 10,
    },
    horizontalImage: {
        width: '100%',
        height: '100%',
    },
    horizontalContent: {
        padding: 8,
    },
    nameHorizontal: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
        height: 32,
        lineHeight: 16,
    },
    badgeSmall: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: Colors.light.brand.sale,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
    },
    badgeTextSmall: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '800',
    },
    discountPriceHorizontal: {
        fontSize: 10,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 4,
    },
    stockBarContainer: {
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 6,
        marginBottom: 2,
    },
    stockBarFill: {
        height: '100%',
        backgroundColor: Colors.light.brand.primary,
    },
    stockText: {
        fontSize: 9,
        color: Colors.light.brand.primary,
        fontWeight: '600',
    },
});
