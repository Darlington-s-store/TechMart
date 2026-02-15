import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StatusBar,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PRODUCTS } from '@/constants/dummy-data';
import { useCart } from '@/hooks/use-cart';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addToCart, totalItems } = useCart();

    const product = PRODUCTS.find((p) => p.id === id);
    const relatedProducts = PRODUCTS.filter(p => p.category === product?.category && p.id !== product?.id);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

    if (!product) {
        return (
            <SafeAreaView style={styles.notFoundContainer}>
                <ThemedText>Product not found</ThemedText>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ThemedText style={{ color: '#007AFF' }}>Go Back</ThemedText>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }



    const renderImageItem = ({ item }: { item: any }) => (
        <View style={styles.imageWrapper}>
            <Image
                source={item}
                style={styles.productImage}
                contentFit="contain"
                transition={300}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            {/* Header (Transparent / Floating) */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.roundButton}
                    onPress={() => router.back()}
                >
                    <IconSymbol name="arrow.left" size={20} color="#000" />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.roundButton}
                        onPress={() => router.push('/cart')}
                    >
                        <IconSymbol name="cart" size={20} color="#000" />
                        {totalItems > 0 && (
                            <View style={styles.cartBadge}>
                                <ThemedText style={styles.cartBadgeText}>{totalItems}</ThemedText>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton}>
                        <IconSymbol name="square.and.arrow.up" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }} // Space for bottom bar
            >
                {/* Image Gallery */}
                <View style={styles.galleryContainer}>
                    {product.images && product.images.length > 0 ? (
                        <>
                            <FlatList
                                data={product.images}
                                renderItem={renderImageItem}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(ev) => {
                                    const newIndex = Math.round(
                                        ev.nativeEvent.contentOffset.x / width
                                    );
                                    setActiveImageIndex(newIndex);
                                }}
                            />
                            <View style={styles.pagination}>
                                {product.images.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.paginationDot,
                                            activeImageIndex === index && styles.paginationDotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        </>
                    ) : (
                        <View style={styles.imageWrapper}>
                            <Image
                                source={product.image}
                                style={styles.productImage}
                                contentFit="contain"
                                transition={300}
                            />
                        </View>
                    )}
                </View>

                {/* Content Body */}
                <View style={styles.body}>

                    {/* Title & Brand */}
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <ThemedText style={styles.brandText}>{product.brand}</ThemedText>
                            <ThemedText style={styles.productName}>{product.name}</ThemedText>
                        </View>
                        <TouchableOpacity style={styles.wishlistFloat}>
                            <IconSymbol name="heart" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Rating & Sold */}
                    <View style={styles.metaRow}>
                        <View style={styles.ratingBadge}>
                            <IconSymbol name="star.fill" size={14} color="#fff" />
                            <ThemedText style={styles.ratingValue}>{product.rating}</ThemedText>
                        </View>
                        <ThemedText style={styles.reviewCount}>{product.reviews} Reviews</ThemedText>
                        <View style={styles.dotSeparator} />
                        <ThemedText style={styles.salesText}>{product.recentSales}</ThemedText>
                    </View>

                    {/* Price Section */}
                    <View style={styles.priceSection}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                            <ThemedText style={styles.currentPrice}>₵{product.discountPrice || product.price}</ThemedText>
                        </View>
                    </View>

                </View>

                {/* Tabs Header */}
                <View style={styles.tabsHeader}>
                    {['description', 'specs', 'reviews'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <ThemedText style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.tabContent}>
                    {activeTab === 'description' && (
                        <View style={styles.section}>
                            <ThemedText style={styles.descriptionText}>{product.description}</ThemedText>
                        </View>
                    )}

                    {activeTab === 'specs' && product.specs && (
                        <View style={styles.specsGrid}>
                            {Object.entries(product.specs).map(([key, value]) => (
                                <View key={key} style={styles.specItem}>
                                    <ThemedText style={styles.specLabel}>{key}</ThemedText>
                                    <ThemedText style={styles.specValue}>{value}</ThemedText>
                                </View>
                            ))}
                        </View>
                    )}

                    {activeTab === 'reviews' && (
                        <View>
                            <View style={styles.reviewHeader}>
                                <ThemedText type="subtitle">Customer Reviews ({product.reviews})</ThemedText>
                                <TouchableOpacity style={styles.writeReviewBtn}>
                                    <ThemedText style={styles.writeReviewText}>Write a Review</ThemedText>
                                </TouchableOpacity>
                            </View>

                            {/* Dummy Reviews */}
                            {[1, 2].map((i) => (
                                <View key={i} style={styles.reviewItem}>
                                    <View style={styles.reviewUserRow}>
                                        <View style={styles.userAvatar}>
                                            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>U{i}</ThemedText>
                                        </View>
                                        <View>
                                            <ThemedText style={styles.reviewUserName}>User {i}</ThemedText>
                                            <View style={{ flexDirection: 'row' }}>{[1, 2, 3, 4, 5].map(s => <IconSymbol key={s} name="star.fill" size={10} color="#FFD700" />)}</View>
                                        </View>
                                        <ThemedText style={styles.reviewDate}>2 days ago</ThemedText>
                                    </View>
                                    <ThemedText style={styles.reviewBody}>Great product! Really satisfied with the quality and delivery speed.</ThemedText>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <View style={styles.relatedSection}>
                        <ThemedText type="subtitle" style={{ marginBottom: 16, paddingHorizontal: 20 }}>You might also like</ThemedText>
                        <FlatList
                            data={relatedProducts}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.relatedCard}
                                    onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
                                >
                                    <View style={styles.relatedImageC}>
                                        <Image source={item.image} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                                    </View>
                                    <ThemedText numberOfLines={1} style={styles.relatedName}>{item.name}</ThemedText>
                                    <ThemedText style={styles.relatedPrice}>₵{item.discountPrice || item.price}</ThemedText>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.qtyContainer}>
                    <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtnSmall}>
                        <IconSymbol name="minus" size={16} color="#333" />
                    </TouchableOpacity>
                    <ThemedText style={styles.qtyText}>{quantity}</ThemedText>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtnSmall}>
                        <IconSymbol name="plus" size={16} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.addToCartBtn}
                        onPress={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.discountPrice || product.price,
                            image: product.image,
                        }, quantity)}
                    >
                        <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buyNowBtn}
                        onPress={() => {
                            addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.discountPrice || product.price,
                                image: product.image,
                            }, quantity);
                            router.push('/cart');
                        }}
                    >
                        <ThemedText style={styles.buyNowText}>Buy Now</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
    },

    // Header
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 20,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 50,
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    cartBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#FF4500',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },

    // Gallery
    galleryContainer: {
        width: width,
        height: width * 0.9,
        backgroundColor: '#FAFAFA',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        width: width,
        height: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    paginationDotActive: {
        backgroundColor: '#FF6600',
        width: 24,
    },

    // Body
    body: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30, // Overlap
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    brandText: {
        fontSize: 14,
        color: '#FF6600',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    productName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#333',
        lineHeight: 32,
    },
    wishlistFloat: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Meta
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    ratingValue: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },
    reviewCount: {
        color: '#666',
        fontSize: 14,
        marginLeft: 10,
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
    salesText: {
        color: '#888',
        fontSize: 14,
    },

    // Price
    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        backgroundColor: '#FFF8F0',
        padding: 16,
        borderRadius: 16,
    },
    currentPrice: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FF4500',
    },
    originalPrice: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
        marginBottom: 4,
    },
    discountTag: {
        backgroundColor: '#FF4500',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    discountTagText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12,
    },

    divider: {
        height: 1,
        backgroundColor: '#f5f5f5',
        marginVertical: 10,
    },

    // Section
    section: {
        marginTop: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 24,
    },

    // Specs
    specsGrid: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    specItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    specLabel: {
        color: '#888',
        fontSize: 14,
    },
    specValue: {
        color: '#333',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'right',
        maxWidth: '60%',
    },

    // Tabs
    tabsHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 16,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabItemActive: {
        borderBottomColor: '#FF6600',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#FF6600',
    },
    tabContent: {
        paddingHorizontal: 20,
        minHeight: 200,
    },

    // Reviews
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    writeReviewBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    writeReviewText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    reviewItem: {
        marginBottom: 16,
        backgroundColor: '#FAFAFA',
        padding: 12,
        borderRadius: 12,
    },
    reviewUserRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    reviewUserName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    reviewDate: {
        marginLeft: 'auto',
        fontSize: 12,
        color: '#999',
    },
    reviewBody: {
        fontSize: 13,
        color: '#555',
        lineHeight: 18,
    },

    // Related
    relatedSection: {
        marginTop: 30,
        marginBottom: 20,
    },
    relatedCard: {
        width: 140,
        marginRight: 0,
    },
    relatedImageC: {
        width: 140,
        height: 140,
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
    },
    relatedName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    relatedPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FF6600',
    },


    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 34 : 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        gap: 16,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 24,
        padding: 4,
        gap: 12,
        height: 48,
        paddingHorizontal: 12,
    },
    qtyBtnSmall: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    qtyText: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    actionButtons: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
    },
    addToCartBtn: {
        flex: 1,
        backgroundColor: '#000',
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    buyNowBtn: {
        flex: 1,
        backgroundColor: '#FF6600',
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyNowText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});
