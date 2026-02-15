# Search and Filtering Features

## Overview
TechMart now includes comprehensive product search and filtering capabilities across multiple screens.

## Product Database Expansion

### Total Products: 22
- **Laptops**: 10 products
  - Brands: Apple, Dell, Lenovo, ASUS, HP, Toshiba
  - Subcategories: Professional, Business, Budget
  
- **Phones**: 6 products
  - Brands: Apple, Samsung, Google, OnePlus, Xiaomi
  - Subcategories: Flagship, Mid-Range, Budget
  
- **Accessories**: 4 products
  - Brands: Apple, Samsung, JBL, Beats, Sony
  - Subcategories: Headphones, Earbuds, Speakers
  
- **Perfumes**: 4 products
  - Brands: Dior, Creed, Chanel, Guerlain, Tom Ford
  - Subcategories: Mens, Womens, Unisex

## Search Functionality

### Home Screen Search
- **Location**: AppHeader at the top
- **Behavior**: Real-time filtering as user types
- **Coverage**: Searches across product names and descriptions
- **Action**: Can navigate to Explore page with search query

### Explore Page Search
- **Location**: AppHeader search bar
- **Real-time**: Products filter instantly as you type
- **Combined with Filters**: Search works alongside category/subcategory/brand filters
- **Example**: Search "headphones" while in Accessories category

### Search Features
1. **Product Name Matching**: Finds exact and partial product name matches
2. **Description Search**: Can search product descriptions
3. **Case Insensitive**: "iphone" = "iPhone" = "IPHONE"
4. **Multiple Keywords**: Search multiple words to narrow results

## Filtering System

### Primary Filtering - Categories
Located in left sidebar on Explore page:
- **Laptops**: 10 products
- **Phones**: 6 products
- **Accessories**: 4 products
- **Perfumes**: 4 products

Click any category to filter all subcategories and brands for that category.

### Secondary Filtering - Subcategories
Accessed via "Filter & Brands" button:
1. Tap the filter button in the main area
2. Choose a subcategory to filter further
3. Active filters show as colored chips
4. Remove filters by clicking the X on chips

### Tertiary Filtering - Brands
Also accessed via "Filter & Brands" button:
1. Select a brand to show only products from that brand
2. Multiple brands can be selected (each selection toggles)
3. Works in combination with subcategory filters
4. Always within the current category

### Filter Combinations
- **Category + Subcategory**: E.g., "Laptops" → "Professional"
- **Category + Brand**: E.g., "Phones" → "Samsung"
- **Category + Subcategory + Brand**: E.g., "Laptops" → "Business" → "Lenovo"
- **Search + Filters**: Search term works with all active filters

## Home Screen Improvements

### "Just For You" Section
- **Display Count**: Up to 16 products
- **Content**: When viewing "All" category, shows randomized mix of all products
- **Category-Specific**: When category is selected, shows products from that category
- **Grid Layout**: 2-column grid for better visibility

### Product Categories
- All products
- Laptops
- Phones
- Accessories
- Perfumes

## Filter Reset Options

### Individual Filter Removal
- Click the X on any active filter chip
- Click category in sidebar to reset subcategory/brand filters

### Complete Reset
- Click "Clear Filters" in empty state (when no products match)
- Change category selection
- Clear search query

## Data Structure

### Product Object
```typescript
{
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
  stock: number;
  recentSales: string;
  image: any;
  images: any[];
  specs: { [key: string]: string };
}
```

### Available Categories
- Laptops
- Phones
- Accessories
- Perfumes

### Available Brands by Category
**Laptops**: Apple, Dell, Lenovo, ASUS, HP, Toshiba
**Phones**: Apple, Samsung, Google, OnePlus, Xiaomi
**Accessories**: Apple, Samsung, JBL, Beats, Sony
**Perfumes**: Dior, Creed, Chanel, Guerlain, Tom Ford

### Available Subcategories
**Laptops**: Professional, Business, Budget
**Phones**: Flagship, Mid-Range, Budget
**Accessories**: Headphones, Earbuds, Speakers
**Perfumes**: Mens, Womens, Unisex

## Performance Notes

- Search uses memoization to prevent unnecessary recalculations
- Filter combinations are computed efficiently
- Products load instantly even with 22+ items
- Grid layout optimized for mobile screens

## Future Enhancements

Possible additions:
- Price range filtering
- Rating/review filtering
- Wishlist/saved products
- Recently viewed products
- Product recommendations based on search history
- Advanced search with multiple keyword support
- Filter presets/saved searches
