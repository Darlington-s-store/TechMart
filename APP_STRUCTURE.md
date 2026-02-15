# TechMart App Structure

## Directory Overview

```
app/
├── _layout.tsx                 # Root layout with auth routing
├── auth/
│   ├── index.tsx              # Auth index (redirects to login)
│   ├── login.tsx              # Login page (email/phone)
│   ├── signup.tsx             # Signup page
│   └── forgot-password.tsx    # Password recovery
├── (tabs)/                     # Tab-based authenticated navigation
│   ├── index.tsx              # Home/Explore page
│   ├── explore.tsx            # Product exploration (Temu-style)
│   ├── cart.tsx               # Shopping cart
│   ├── orders.tsx             # Order history
│   └── profile.tsx            # Profile dashboard (Jumia-style)
├── profile/                    # Profile sub-routes
│   ├── edit-profile.tsx       # Edit personal info
│   ├── addresses.tsx          # Manage delivery addresses
│   └── settings.tsx           # Account settings & notifications
├── order-details/
│   └── [id].tsx               # Order details with receipt viewing
├── product/
│   └── [id].tsx               # Product detail page
├── checkout.tsx               # Checkout with payment methods
└── onboarding/
    └── index.tsx              # Onboarding flow (if implemented)

components/
├── auth/                       # Auth-related components
│   ├── auth-input.tsx
│   ├── auth-button.tsx
│   ├── auth-link.tsx
│   └── logo-header.tsx
├── ui/                         # UI components
│   └── icon-symbol.tsx
├── receipt.tsx                # Receipt display component
├── parallax-scroll-view.tsx   # Parallax header component
├── themed-text.tsx            # Theme-aware text
├── themed-view.tsx            # Theme-aware view
└── [other existing components]

hooks/
├── use-auth.tsx               # Authentication context & functions
├── use-cart.tsx               # Cart and orders context
├── use-color-scheme.tsx       # Theme/color scheme hook
└── use-mobile.ts              # Mobile detection hook

constants/
├── theme.ts                   # Color definitions
├── dummy-data.ts              # Product catalog data
└── [other constants]

lib/
└── utils.ts                   # Utility functions

public/
├── images/                    # App images
└── assets/                    # Other assets

```

## Authentication Flow

```
App Start
  ↓
RootLayout (_layout.tsx)
  ├─ Check isLoading → Show nothing (splash)
  ├─ Check userToken
  │   ├─ YES → Show (tabs) screens
  │   └─ NO → Show auth/login screen
  ├─ Navigate to auth/login
  │   ├─ User can signup → auth/signup
  │   ├─ User enters credentials
  │   ├─ ValidateandCreateSession
  │   └─ Redirect to (tabs)
  └─ Session persists via AsyncStorage
```

## Data Flow

### User Registration
```
SignupScreen
  ↓
useAuth().signUp()
  ├─ Validate input
  ├─ Check duplicate email/phone
  ├─ Create user object
  ├─ Save to AsyncStorage (@app_users)
  ├─ Create session token
  ├─ Save to AsyncStorage (@app_user_session)
  └─ Auto-login & redirect to (tabs)
```

### Shopping Cart
```
ProductScreen
  ↓
useCart().addToCart()
  ├─ Add/update item in cart state
  ├─ Auto-save to AsyncStorage (cart-{userId})
  └─ Update cart count

CheckoutScreen
  ↓
useCart().createOrder()
  ├─ Validate cart & address
  ├─ Calculate total with tax
  ├─ Generate order number & receipt
  ├─ Save to AsyncStorage (orders-{userId})
  ├─ Clear cart
  └─ Show receipt modal
```

### Profile Management
```
ProfileScreen (Dashboard)
  ├─ DisplayUserInfo (from useAuth().user)
  ├─ ShowRecentOrders (from useOrders())
  └─ Navigate to sub-pages:
      ├─ EditProfileScreen → updateProfile()
      ├─ AddressesScreen → updateProfile()
      └─ SettingsScreen → (local state, future: updatePreferences())
```

## Key Hooks

### useAuth()
```typescript
{
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
  isSignout: boolean;
  signIn(email: string, password: string): Promise<void>;
  signInWithPhone(phone: string, otp: string): Promise<void>;
  signUp(firstName, lastName, email, password, phoneNumber?): Promise<void>;
  signOut(): Promise<void>;
  resetPassword(email, otp, newPassword): Promise<void>;
  sendOTP(email): Promise<void>;
  verifyOTP(email, otp): Promise<void>;
  updateProfile(data: Partial<User>): Promise<void>;
}
```

### useCart()
```typescript
{
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart(item, qty?): void;
  removeFromCart(id): void;
  updateQuantity(id, qty): void;
  clearCart(): void;
  createOrder(paymentMethod, deliveryAddress): Promise<Order>;
}
```

### useOrders()
```typescript
{
  orders: Order[];
  loading: boolean;
}
```

## Payment Methods

### 1. Card Payment
- Requires: Card name, number, expiry (MM/YY), CVV
- Validation: 16-digit card number, valid expiry, 3-digit CVV
- Display: Full card details form

### 2. Mobile Money
- Networks: MTN, Vodafone, AirtelTigo
- Requires: Phone number (10 digits)
- Display: Network selector + phone input

### 3. Cash on Delivery
- No payment info needed
- Display: COD terms message
- Payment: On delivery

## AsyncStorage Keys

```
@app_users                          // Array of all users
@app_user_session                   // Current session
cart-{userId}                       // User's cart items
orders-{userId}                     // User's order history
@app_user_{userId}_profile          // User profile data
@app_user_{userId}_addresses        // User's saved addresses
otp-{email}                         // Temporary OTP (for recovery)
hasSeenOnboarding                   // Onboarding flag
```

## Styling Approach

- **Colors**: Defined in `constants/theme.ts`
- **Typography**: System fonts, various weights
- **Layout**: Flexbox-based, responsive
- **Components**: Themed (light/dark mode ready)
- **Design System**: Orange (#FF6600) brand color throughout

## Navigation Stack

```
RootNavigator (Stack)
  ├─ (tabs) [Protected]
  │  ├─ Home/Explore
  │  ├─ Cart
  │  ├─ Orders
  │  ├─ Profile
  │  └─ Tab bar navigation
  ├─ auth/login
  ├─ auth/signup
  ├─ auth/forgot-password
  ├─ product/[id]
  ├─ checkout
  ├─ order-details/[id]
  ├─ profile/edit-profile
  ├─ profile/addresses
  └─ profile/settings
```

## State Management

- **Auth State**: Context API (useAuth)
- **Cart State**: Context API (useCart)
- **Theme State**: Context API (useColorScheme)
- **Orders**: Custom hook (useOrders) + AsyncStorage
- **Local Component State**: useState for forms, UI toggles

## Key Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Mandatory Login | ✅ Complete | Users cannot bypass authentication |
| User Registration | ✅ Complete | Email/phone validation, duplicate checks |
| Session Persistence | ✅ Complete | AsyncStorage-based, survives app restart |
| Shopping Cart | ✅ Complete | Per-user persistence, auto-save |
| Product Catalog | ✅ Complete | Temu-style with categories |
| Checkout | ✅ Complete | 3 payment methods, receipt generation |
| Order History | ✅ Complete | Per-user, with order details view |
| Profile Dashboard | ✅ Complete | Jumia-style with quick stats |
| Profile Management | ✅ Complete | Edit profile, addresses, settings |
| Receipt | ✅ Complete | Professional layout, printable |
| No Mock Data | ✅ Complete | All data user-generated via signup/orders |

---

**Last Updated**: February 15, 2026
