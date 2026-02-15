// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Partial<Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'laptopcomputer': 'laptop',
  'iphone': 'smartphone',
  'headphones': 'headphones',
  'flame': 'local-fire-department',
  'flame.fill': 'local-fire-department',
  'person.fill': 'person',
  'chevron.left': 'chevron-left',
  'cart.fill': 'shopping-cart',
  'cart': 'shopping-cart',
  'square.grid.2x2': 'grid-view',
  'square.grid.2x2.fill': 'grid-view',
  'bag.fill': 'shopping-bag',
  'magnifyingglass': 'search',
  'bell': 'notifications',
  'heart': 'favorite-border',
  'heart.fill': 'favorite',
  'star.fill': 'star',
  'plus': 'add',
  'minus': 'remove',
  'airplane': 'flight',
  'arrow.triangle.2.circlepath': 'cached',
  'shield.fill': 'verified-user',
  'clock.fill': 'schedule',
  'tshirt.fill': 'checkroom',
  'sportscourt.fill': 'sports-basketball',
  'camera.fill': 'camera-alt',
  'truck.fill': 'local-shipping',
  'message': 'chat-bubble-outline',
  'square.and.arrow.up': 'share',
  'star': 'star-border',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName | (string & {});
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name as IconSymbolName]} style={style} />;
}
