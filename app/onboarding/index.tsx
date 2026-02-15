import React from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { LogoHeader } from '@/components/auth/logo-header';

interface SlideItem {
    id: string;
    title: string;
    description: string;
    image: any;
}

const slides: SlideItem[] = [
    {
        id: '1',
        title: 'Shop Quality Tech',
        description: 'Buy laptops, phones, accessories and authentic perfumes in one trusted store.',
        image: require('@/assets/Laptop banner.webp'), // Placeholder
    },
    {
        id: '2',
        title: 'Fast Delivery & Tracking',
        description: 'Track your order from payment to delivery, with real-time updates.',
        image: require('@/assets/perfume1.jpg'), // Placeholder
    },
    {
        id: '3',
        title: 'Secure Payments',
        description: 'Pay safely via Mobile Money or Card and enjoy discounts and flash sales.',
        image: require('@/assets/payment.jpeg'), // Placeholder
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const flatListRef = React.useRef<FlatList>(null);

    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            router.replace('/auth/welcome'); // Navigate to Auth Gateway
        } catch (error) {
            console.error('Error saving onboarding status:', error);
        }
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleComplete();
        }
    };

    const renderItem = ({ item }: { item: SlideItem }) => (
        <View style={[styles.slide, { width }]}>
            <View style={styles.imageContainer}>
                {/* Using LogoHeader as a placeholder for now if specific images aren't available */}
                {/* Ideally, we should use item.image here */}
                <LogoHeader size={200} />
            </View>
            <View style={styles.textContainer}>
                <ThemedText type="title" style={styles.title}>{item.title}</ThemedText>
                <ThemedText style={styles.description}>{item.description}</ThemedText>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colors.brand.gradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <StatusBar barStyle="light-content" />

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.footer}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: currentIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                                    width: currentIndex === index ? 24 : 8,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {currentIndex < slides.length - 1 ? (
                        <>
                            <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
                                <ThemedText style={styles.skipText}>Skip</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                                <ThemedText style={styles.nextText}>Next</ThemedText>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={handleComplete} style={styles.getStartedButton}>
                            <ThemedText style={styles.getStartedText}>Get Started</ThemedText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 0.4,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 16,
        color: '#fff',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 24,
    },
    footer: {
        padding: 20,
        paddingBottom: 50,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    skipButton: {
        padding: 10,
    },
    skipText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
    },
    nextText: {
        color: '#FF6600', // Brand color
        fontSize: 16,
        fontWeight: '700',
    },
    getStartedButton: {
        backgroundColor: '#fff',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
    },
    getStartedText: {
        color: '#FF6600', // Brand color
        fontSize: 18,
        fontWeight: '700',
    },
});
