export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: 'Laptops' | 'Phones' | 'Accessories' | 'Perfumes';
    subcategory: string;
    brand: string;
    rating: number;
    reviews: number;
    stock: number; // For progress bars
    recentSales: string; // e.g., "50+ bought recently"
    image: any;
    images: any[];
    specs: { [key: string]: string };
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'APPLE MACBOOK PRO 16 TOUCHBAR',
        description: 'The most powerful MacBook Pro ever. Features the new M3 Max chip for extreme performance.',
        price: 5937.00,
        discountPrice: 6500.00,
        category: 'Laptops',
        subcategory: 'Professional',
        brand: 'Apple',
        rating: 4.8,
        reviews: 245,
        stock: 5,
        recentSales: '12 bought in last hour',
        image: require('../assets/MacBook.webp'),
        images: [
            require('../assets/Mac1.webp'),
            require('../assets/Mac2.webp'),
        ],
        specs: {
            Display: '16-inch Liquid Retina XDR',
            Processor: 'APPLE MACBOOK PRO 16 TOUCHBAR 32GB RAM 512GB SSD 8 CORE 5.0GHz i9 - TAHOE',
            RAM: '36GB',
            Storage: '1TB SSD',
        },
    },
    {
        id: '2',
        name: 'Apple iPhone 15 Pro Max 6.7',
        description: 'Apple iPhone 15 Pro Max 6.7" Unlocked 512GB - (Blue Titanium) A2849 w/Warranty.',
        price: 8900.00,
        category: 'Phones',
        subcategory: 'Flagship',
        brand: 'Apple',
        rating: 4.9,
        reviews: 890,
        stock: 120,
        recentSales: '1k+ sold',
        image: require('../assets/Iphone 15 Pro mMax.webp'),
        images: [
            require('../assets/iPhone 15.webp'),
        ],
        specs: {
            Display: '6.7-inch Super Retina XDR',
            Processor: 'A17 Pro',
            Camera: '48MP Main | Ultra Wide | Telephoto',
            Battery: 'Up to 29 hours video playback',
        },
    },
    {
        id: '3',
        name: 'Sony WH-1000XM5',
        description: 'ORIGINAL Sony WH-1000XM5 Wireless Noise Canceling Headphones - Black GA.',
        price: 398.00,
        discountPrice: 250.00,
        category: 'Accessories',
        subcategory: 'Headphones',
        brand: 'Sony',
        rating: 4.7,
        reviews: 120,
        stock: 8,
        recentSales: 'Almost sold out',
        image: require('../assets/Sony WH-1000XM5.webp'),
        images: [
            require('../assets/Sony WH-1000XM5.webp'),
        ],
        specs: {
            Type: 'Over-ear',
            BatteryLife: '30 hours',
            Features: 'Noise Canceling, Multipoint',
        },
    },
    {
        id: '4',
        name: 'Dior Sauvage Elixir',
        description: 'Dior Sauvage Men\'s 3.4 fl oz Parfum Spray.',
        price: 100.00,
        discountPrice: 85.00,
        category: 'Perfumes',
        subcategory: 'Mens',
        brand: 'Dior',
        rating: 4.9,
        reviews: 56,
        stock: 45,
        recentSales: 'High demand',
        image: require('../assets/Dior Sauvage Elixir.webp'),
        images: [
            require('../assets/Dior Sauvage Elixir.webp'),
        ],
        specs: {
            Size: '60ml',
            Type: 'Parfum',
            Notes: 'Grapefruit, Spices, Organic AOP Lavender, Woods',
        },
    },
    {
        id: '5',
        name: 'Dell XPS 15',
        description: 'Dell XPS 15 9530 – 15.6" FHD+ – i9-13700H – 16GB RAM–Arc A370M–512GB SSD –Silver.',
        price: 9500.00,
        category: 'Laptops',
        subcategory: 'Business',
        brand: 'Dell',
        rating: 4.6,
        reviews: 88,
        stock: 2,
        recentSales: 'Last 2 left!',
        image: require('../assets/Dell.webp'),
        images: [
            require('../assets/Dell2.webp'),
        ],
        specs: {
            Display: '15.6" OLED 3.5K',
            Processor: 'Intel Core i9',
            RAM: '16GB',
            Storage: '512GB SSD',
        },
    },
    {
        id: '6',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'open box Samsung Galaxy S24 Ultra 512GB S-928U1 Titanium gray factory unlockedOpens in a new window or tab',
        price: 8800.00,
        category: 'Phones',
        subcategory: 'Flagship',
        brand: 'Samsung',
        rating: 4.8,
        reviews: 312,
        stock: 200,
        recentSales: 'Popular',
        image: require('../assets/Samsung Galaxy S24 Ultra.webp'),
        images: [
            require('../assets/Samsung Galaxy S24 Ultra.webp'),
        ],
        specs: {
            Display: '6.8" QHD+',
            Processor: 'Snapdragon 8 Gen 3',
            Camera: '200MP Main',
            Battery: '5000mAh',
        },
    },
];
