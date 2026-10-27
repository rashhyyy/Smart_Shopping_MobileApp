/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   ADD ITEM SCREEN — PriceScan App                        ║
 * ║   Drop this file into your project as a screen           ║
 * ╠══════════════════════════════════════════════════════════╣
 * ║  INSTALL:                                                 ║
 * ║  npx expo install expo-speech expo-haptics               ║
 * ║  npx expo install @react-native-async-storage/async-storage║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Usage in Expo Router → app/(tabs)/add.tsx
 * Or as standalone screen in any React Navigation setup
 */
import { useRouter, useLocalSearchParams } from 'expo-router';

import * as Haptics from 'expo-haptics';
import {
  isSpeechRecognitionNativeAvailable,
  requestSpeechPermissionsAsync,
  getSpeechPermissionsAsync,
  startSpeechRecognition,
  stopSpeechRecognition,
  abortSpeechRecognition,
  addSpeechEventListener,
} from '../services/speechService';
import {
  LayoutGrid,
  Scan,
  PlusCircle,
  ShoppingBag,
  PieChart,
  ArrowLeft
} from 'lucide-react-native';
import { useUser } from '../context/UserContext';
import { parseVoiceShoppingCommand } from '../utils/voiceParser';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────
const T = {
  bg: '#FAFAF8',
  bg2: '#F5F0EB',
  card: '#FFFFFF',
  border: '#EDE8E2',
  borderFocus: '#F07030',
  accent: '#F07030',
  accentSoft: '#FEF0E8',
  accentSofter: '#FFF8F4',
  accentDark: '#C85820',
  text: '#1A1208',
  textSub: '#7A6E64',
  textMuted: '#B8AFA6',
  white: '#FFFFFF',
  success: '#18A058',
  successSoft: '#EDFBF3',
  navBg: '#FFFFFF',
  navBorder: '#EDE8E2',
  shadow: 'rgba(200,140,80,0.12)',
  inputBg: '#FFFFFF',
  voiceBg: '#FEF0E8',
  voiceBorder: '#FDDFC8',
  disabled: '#D4CFC9',
  disabledText: '#A8A09A',
  red: '#E84040',
};

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'grocery', label: 'Grocery', icon: '🛒' },
  { id: 'beverage', label: 'Beverage', icon: '🥤' },
  { id: 'snacks', label: 'Snacks', icon: '🍿' },
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'produce', label: 'Produce', icon: '🥦' },
  { id: 'bakery', label: 'Bakery', icon: '🍞' },
  { id: 'meat', label: 'Meat', icon: '🥩' },
  { id: 'personal', label: 'Personal', icon: '🧴' },
  { id: 'household', label: 'Household', icon: '🏠' },
  { id: 'other', label: 'Other', icon: '📦' },
];

// ─────────────────────────────────────────────
// VOICE EXAMPLES
// ─────────────────────────────────────────────
const VOICE_EXAMPLES = [
  '"Add milk for 72 rupees"',
  '"Bread 45 rupees snacks"',
  '"Rice 150"',
  '"Eggs 80 dairy"',
];

// ─────────────────────────────────────────────
// VOICE MODAL (for Expo Go keyboard microphone dictation)
// ─────────────────────────────────────────────
interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

function VoiceModal({ visible, onClose, onSubmit }: VoiceModalProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) setText('');
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={vm.overlay}
      >
        <View style={vm.card}>
          <View style={vm.iconWrap}>
            <Text style={{ fontSize: 26 }}>🎙</Text>
          </View>
          <Text style={vm.title}>Voice Shopping Assistant</Text>
          <Text style={vm.subtitle}>
            Tap your keyboard's microphone 🎙 to speak your command, or type below:
          </Text>

          <View style={vm.inputWrap}>
            <TextInput
              style={vm.input}
              value={text}
              onChangeText={setText}
              placeholder='e.g. "Two fresh milk, 100 rupees"'
              placeholderTextColor={T.textMuted}
              autoFocus
              multiline
              returnKeyType="done"
            />
          </View>

          <Text style={vm.hint}>
            Try: "Three apples, 50 rupees each, 10 percent discount"
          </Text>

          <View style={vm.btnRow}>
            <TouchableOpacity style={vm.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={vm.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[vm.applyBtn, !text.trim() && { backgroundColor: T.disabled }]}
              disabled={!text.trim()}
              onPress={() => {
                onSubmit(text.trim());
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Text style={vm.applyTxt}>Auto-Fill Form</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const vm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,10,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: T.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: T.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: T.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: T.textSub,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputWrap: {
    width: '100%',
    backgroundColor: T.inputBg,
    borderWidth: 1.5,
    borderColor: T.borderFocus,
    borderRadius: 14,
    padding: 12,
    minHeight: 80,
    marginBottom: 10,
  },
  input: {
    fontSize: 15,
    color: T.text,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 11,
    color: T.textMuted,
    fontStyle: 'italic',
    marginBottom: 18,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textSub,
  },
  applyBtn: {
    flex: 1.4,
    backgroundColor: T.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: T.white,
  },
});

// ─────────────────────────────────────────────
// SUCCESS POPUP
// ─────────────────────────────────────────────
interface SuccessPopupProps {
  visible: boolean;
  itemName: string;
  price: number;
  currencySymbol?: string;
  onHide: () => void;
}

function SuccessPopup({ visible, itemName, price, currencySymbol = '$', onHide }: SuccessPopupProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 65,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onHide());
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={popup.overlay}>
        <Animated.View
          style={[popup.card, { transform: [{ scale }], opacity }]}
        >
          <View style={popup.iconWrap}>
            <Text style={popup.icon}>✓</Text>
          </View>
          <Text style={popup.title}>Added to Cart!</Text>
          <Text style={popup.name} numberOfLines={1}>{itemName}</Text>
          <Text style={popup.price}>{currencySymbol} {price.toFixed(2)}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const popup = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,10,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: T.white,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
    minWidth: 220,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: T.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 28, color: T.success },
  title: { fontSize: 18, fontWeight: '800', color: T.text },
  name: { fontSize: 14, color: T.textSub, maxWidth: 180 },
  price: { fontSize: 22, fontWeight: '900', color: T.accent, marginTop: 4 },
});

// ─────────────────────────────────────────────
// VOICE BANNER
// ─────────────────────────────────────────────
interface VoiceBannerProps {
  listening: boolean;
  transcript: string;
  statusMessage?: string | null;
  onPress: () => void;
}

function VoiceBanner({ listening, transcript, statusMessage, onPress }: VoiceBannerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const exampleIdx = useRef(0);
  const [example, setExample] = useState(VOICE_EXAMPLES[0]);

  useEffect(() => {
    if (!listening) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [listening]);

  useEffect(() => {
    const timer = setInterval(() => {
      exampleIdx.current = (exampleIdx.current + 1) % VOICE_EXAMPLES.length;
      setExample(VOICE_EXAMPLES[exampleIdx.current]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TouchableOpacity
      style={[
        vb.wrap,
        listening && { backgroundColor: T.accentSoft, borderColor: T.accent },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Animated.View
        style={[vb.iconWrap, { transform: [{ scale: listening ? pulseAnim : 1 }] }]}
      >
        <Text style={vb.icon}>{listening ? '🎙' : '🎤'}</Text>
      </Animated.View>
      <View style={vb.textWrap}>
        {listening ? (
          <>
            <Text style={[vb.title, { color: T.accent }]}>Listening… (Tap to Stop)</Text>
            <Text style={vb.sub} numberOfLines={2}>
              {transcript || 'Speak item details (e.g. "Two milk, 100 rupees")...'}
            </Text>
          </>
        ) : (
          <>
            <Text style={vb.title}>Tap to Use Voice</Text>
            <Text style={vb.sub} numberOfLines={1}>
              {statusMessage ? statusMessage : `Try: ${example}`}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const vb = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: T.voiceBg,
    borderWidth: 1.5,
    borderColor: T.voiceBorder,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.accent,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  icon: { fontSize: 22 },
  textWrap: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: T.accent,
    letterSpacing: 0.1,
  },
  sub: { fontSize: 12, color: T.textSub, marginTop: 2 },
});

// ─────────────────────────────────────────────
// CATEGORY PILL
// ─────────────────────────────────────────────
function CategoryPill({
  cat,
  selected,
  onPress,
}: {
  cat: { id: string; label: string; icon: string };
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.selectionAsync();
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          cp.pill,
          selected
            ? { backgroundColor: T.accent, borderColor: T.accent }
            : { backgroundColor: T.white, borderColor: T.border },
        ]}
        onPress={handlePress}
        activeOpacity={0.82}
      >
        <Text style={cp.icon}>{cat.icon}</Text>
        <Text
          style={[
            cp.label,
            { color: selected ? T.white : T.textSub },
          ]}
        >
          {cat.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const cp = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  icon: { fontSize: 14 },
  label: { fontSize: 12, fontWeight: '600' },
});

// ─────────────────────────────────────────────
// INPUT FIELD
// ─────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad' | 'numeric';
  prefix?: string;
  suffix?: string;
  autoFocus?: boolean;
  multiline?: boolean;
}

function InputField({
  label, value, onChangeText, placeholder = '',
  keyboardType = 'default', prefix, suffix,
  autoFocus = false, multiline = false,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [T.border, T.borderFocus],
  });

  return (
    <View style={inf.wrap}>
      <Text style={inf.label}>{label}</Text>
      <Animated.View style={[inf.inputWrap, { borderColor }]}>
        {prefix ? <Text style={inf.prefix}>{prefix}</Text> : null}
        <TextInput
          style={[inf.input, multiline && { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={T.textMuted}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          multiline={multiline}
          autoCapitalize={keyboardType === 'default' ? 'words' : 'none'}
          returnKeyType="done"
        />
        {suffix ? <Text style={inf.suffix}>{suffix}</Text> : null}
      </Animated.View>
    </View>
  );
}

const inf = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginBottom: 14 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: T.textSub,
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.inputBg,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    shadowColor: T.accent,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: T.text,
    fontWeight: '500',
  },
  prefix: { fontSize: 16, color: T.textSub, marginRight: 4, fontWeight: '600' },
  suffix: { fontSize: 14, color: T.textMuted, marginLeft: 4 },
});

// ─────────────────────────────────────────────
// BOTTOM NAV (matches your design)
// ─────────────────────────────────────────────
/*

function BottomNav({ activeTab, onTabPress }: {
    
  activeTab: string;
  onTabPress: (t: string) => void;
}) {
    
  const tabs = [
    { id: 'home',    icon: '⊞',  label: 'Home' },
    { id: 'scan',     icon: '◎',  label: 'Scan' },
    { id: 'add',     icon: '+',  label: 'Add', special: true },
    { id: 'cart',    icon: '🛍', label: 'Cart' },
    { id: 'budget',  icon: '◑',  label: 'Budget' },
  ];

  return (
    <View style={bn.wrap}>
      {tabs.map((t) => {
        const active = activeTab === t.id;
        if (t.special) {
          return (
            <TouchableOpacity key={t.id} style={bn.item} onPress={() => onTabPress(t.id)}>
              <View style={[bn.special, active && { backgroundColor: T.accent }]}>
                <Text style={bn.specialIcon}>+</Text>
              </View>
              <Text style={[bn.label, { color: active ? T.accent : T.textMuted }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity key={t.id} style={bn.item} onPress={() => onTabPress(t.id)}>
            <Text style={[bn.icon, { color: active ? T.accent : T.textMuted }]}>{t.icon}</Text>
            <Text style={[bn.label, { color: active ? T.accent : T.textMuted }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}*/

const bn = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: T.navBg,
    borderTopWidth: 1,
    borderTopColor: T.navBorder,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { fontSize: 20 },
  label: { fontSize: 10, fontWeight: '600' },
  special: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
    shadowColor: T.accent,
    shadowOpacity: 0.38,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  specialIcon: { fontSize: 24, color: T.white, fontWeight: '800', lineHeight: 26 },
});

// ─────────────────────────────────────────────
// ADD ITEM SCREEN  ← THE MAIN EXPORT
// ─────────────────────────────────────────────
export interface CartItem {
  id: string;
  label: string;
  price: number;
  discount: number;
  quantity: number;
  category: string;
  note: string;
  addedAt: number;
}

interface AddItemScreenProps {
  /** Called when user successfully adds item */
  onAddItem?: (item: CartItem) => void;
  /** Called when back button pressed */
  onBack?: () => void;
  /** Optional: existing cart for duplicate detection */
  existingCart?: CartItem[];
}

export default function AddItemScreen({
  onAddItem,
  onBack,
  existingCart = [],
}: AddItemScreenProps) {
  const params = useLocalSearchParams<{ autoVoice?: string }>();
  const [activeTab, setActiveTab] = useState('add');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('grocery');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedItem, setAddedItem] = useState<{ name: string; price: number } | null>(null);

  const isStartingRef = useRef(false);
  const lastRecognizedRef = useRef<string>('');

  // Scroll indicator shadow
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerShadowOpacity = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 0.08],
    extrapolate: 'clamp',
  });

  // Add button press animation
  const btnScale = useRef(new Animated.Value(1)).current;

  const discountedPrice = useMemo(() => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discount) || 0;
    if (d <= 0 || d >= 100) return p;
    return p - (p * d) / 100;
  }, [price, discount]);

  const finalTotal = useMemo(() => {
    const qty = parseInt(quantity) || 1;
    return discountedPrice * qty;
  }, [discountedPrice, quantity]);

  const isValid = name.trim().length > 0 && parseFloat(price) > 0;
  const router = useRouter();
  const { currency, addToCart, totalCartItems, customCategories } = useUser();
  const sym = currency?.symbol || '$';

  const allCategories = useMemo(() => {
    return [
      ...CATEGORIES,
      ...(customCategories || []).map((c) => ({
        id: c.id,
        label: c.name,
        icon: c.icon || '🏷️',
      })),
    ];
  }, [customCategories]);

  // ── MICROPHONE PERMISSIONS ─────────────────
  const checkAndRequestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!isSpeechRecognitionNativeAvailable()) {
        return false;
      }

      const perms = await getSpeechPermissionsAsync();
      if (perms.granted) {
        return true;
      }

      const requested = await requestSpeechPermissionsAsync();
      if (requested.granted) {
        return true;
      }

      if (requested.status === 'denied' && !requested.canAskAgain) {
        Alert.alert(
          'Microphone Permission Required',
          'Microphone access is permanently denied. Please enable microphone permission in device settings to use voice input.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        Alert.alert(
          'Microphone Permission Denied',
          'Microphone permission is required to detect shopping items from your voice.'
        );
      }
      return false;
    } catch (e: any) {
      console.warn('Microphone permission check error:', e);
      Alert.alert('Permission Error', e?.message || 'Could not verify microphone permissions.');
      return false;
    }
  }, []);

  // ── EXTRACT AND AUTO-FILL FORM FIELDS ───────
  const handleFinalTranscript = useCallback((text: string) => {
    if (!text || !text.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const parsed = parseVoiceShoppingCommand(text);

    // Auto-fill existing fields for user review (NO automatic cart submission)
    if (parsed.name) {
      setName(parsed.name);
    }
    if (parsed.price !== null && !isNaN(parsed.price)) {
      setPrice(parsed.price.toString());
    }
    if (parsed.quantity > 0) {
      setQuantity(parsed.quantity.toString());
    }
    if (parsed.discount >= 0) {
      setDiscount(parsed.discount.toString());
    }
    if (parsed.category) {
      const matched = CATEGORIES.find((c) => c.id === parsed.category);
      if (matched) {
        setCategory(matched.id);
      }
    }

    let msg = `Filled: "${text}"`;
    if (parsed.price === null) {
      msg += ' — Please enter price';
    }
    setVoiceStatus(msg);
  }, []);

  // ── SPEECH RECOGNITION EVENTS (NATIVE) ───────
  useEffect(() => {
    if (!isSpeechRecognitionNativeAvailable()) return;

    const unsubs = [
      addSpeechEventListener('start', () => {
        setVoiceListening(true);
        setVoiceStatus(null);
      }),
      addSpeechEventListener('result', (event: any) => {
        const text = event?.results?.[0]?.transcript || '';
        if (text) {
          setVoiceTranscript(text);
          lastRecognizedRef.current = text;
        }
        if (event?.isFinal && text) {
          handleFinalTranscript(text);
        }
      }),
      addSpeechEventListener('end', () => {
        setVoiceListening(false);
        if (lastRecognizedRef.current && lastRecognizedRef.current.trim()) {
          handleFinalTranscript(lastRecognizedRef.current);
          lastRecognizedRef.current = '';
        }
      }),
      addSpeechEventListener('error', (event: any) => {
        setVoiceListening(false);
        const errType = event?.error;
        if (errType === 'no-speech' || errType === 'speech-timeout') {
          setVoiceStatus('No speech detected. Tap to try again.');
        } else if (errType === 'not-allowed') {
          Alert.alert('Permission Denied', 'Microphone permission was denied.');
        } else if (errType === 'network') {
          Alert.alert('Network Error', 'Speech recognition requires an internet connection.');
        } else if (errType !== 'aborted') {
          setVoiceStatus(`Voice ended: ${event?.message || errType}`);
        }
      }),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
      abortSpeechRecognition();
    };
  }, [handleFinalTranscript]);

  // ── VOICE TOGGLE HANDLER ───────────────────
  const handleVoice = useCallback(async () => {
    // 1. Native module available (Development Build / Standalone APK)
    if (isSpeechRecognitionNativeAvailable()) {
      if (voiceListening) {
        stopSpeechRecognition();
        setVoiceListening(false);
        return;
      }

      if (isStartingRef.current) return;
      isStartingRef.current = true;
      setVoiceStatus(null);
      setVoiceTranscript('');
      lastRecognizedRef.current = '';

      const hasPermission = await checkAndRequestMicrophonePermission();
      if (!hasPermission) {
        isStartingRef.current = false;
        return;
      }

      try {
        startSpeechRecognition({
          lang: 'en-US',
          interimResults: true,
          maxAlternatives: 1,
        });
        setVoiceListening(true);
        Haptics.selectionAsync();
      } catch (err: any) {
        console.error('Error starting speech recognition:', err);
        Alert.alert('Voice Error', err?.message || 'Could not start speech recognition.');
        setVoiceListening(false);
      } finally {
        isStartingRef.current = false;
      }
      return;
    }

    // 2. Running in Expo Go: Open Voice Assistant dialog for keyboard microphone dictation
    setShowVoiceModal(true);
  }, [voiceListening, checkAndRequestMicrophonePermission]);

  // Handle autoVoice navigation trigger from Home Screen shortcut
  useEffect(() => {
    if (params.autoVoice === 'true') {
      const timer = setTimeout(() => {
        handleVoice();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [params.autoVoice, handleVoice]);

  // ── ADD TO CART ─────────────────────────────
  const handleAdd = useCallback(() => {
    if (!isValid) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Button press animation
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();

    const p = parseFloat(price);
    const d = parseFloat(discount) || 0;
    const q = Math.max(1, parseInt(quantity) || 1);
    const itemUnitPrice = discountedPrice > 0 ? discountedPrice : p;

    const newItem: CartItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: name.trim(),
      price: itemUnitPrice,
      discount: d,
      quantity: q,
      category,
      note: note.trim(),
      addedAt: Date.now(),
    };

    // Save directly to global shared cart state & storage
    addToCart({
      id: newItem.id,
      label: newItem.label,
      price: newItem.price,
      quantity: newItem.quantity,
      category: newItem.category,
      discount: newItem.discount,
      note: newItem.note,
      capturedAt: newItem.addedAt,
    });

    setAddedItem({ name: newItem.label, price: itemUnitPrice * q });
    setShowSuccess(true);

    onAddItem?.(newItem);

    // Reset form after short delay
    setTimeout(() => {
      setName('');
      setPrice('');
      setDiscount('');
      setNote('');
      setQuantity('1');
      setCategory('grocery');
    }, 300);
  }, [isValid, name, price, discount, quantity, category, note, discountedPrice, onAddItem]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ───────────────────────────── */}
      <Animated.View style={[s.header, { shadowOpacity: headerShadowOpacity }]}>
        <TouchableOpacity style={s.roundButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Add Item</Text>
        <View style={s.headerRight} />
      </Animated.View>

      {/* ── SCROLLABLE FORM ──────────────────── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          indicatorStyle="black"
        >

          {/* VOICE BANNER */}
          <VoiceBanner
            listening={voiceListening}
            transcript={voiceTranscript}
            statusMessage={voiceStatus}
            onPress={handleVoice}
          />

          {/* DIVIDER */}
          <View style={s.sectionGap} />

          {/* PRODUCT NAME */}
          <InputField
            label="Product Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Organic Almonds"
            autoFocus={false}
          />

          {/* PRICE + DISCOUNT row */}
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label={`Price (${sym})`}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                keyboardType="decimal-pad"
                prefix={sym}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <InputField
                label="Discount (%)"
                value={discount}
                onChangeText={setDiscount}
                placeholder="0"
                keyboardType="decimal-pad"
                suffix="%"
              />
            </View>
          </View>

          {/* QUANTITY row */}
          <View style={s.qtyWrap}>
            <Text style={s.qtyLabel}>QUANTITY</Text>
            <View style={s.qtyRow}>
              <TouchableOpacity
                style={[s.qtyBtn, { borderColor: T.border }]}
                onPress={() => {
                  const q = Math.max(1, (parseInt(quantity) || 1) - 1);
                  setQuantity(q.toString());
                  Haptics.selectionAsync();
                }}
              >
                <Text style={s.qtyBtnTxt}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={s.qtyInput}
                value={quantity}
                onChangeText={(v) => setQuantity(v.replace(/\D/, ''))}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity
                style={[s.qtyBtn, { borderColor: T.border, backgroundColor: T.accentSoft }]}
                onPress={() => {
                  const q = (parseInt(quantity) || 1) + 1;
                  setQuantity(q.toString());
                  Haptics.selectionAsync();
                }}
              >
                <Text style={[s.qtyBtnTxt, { color: T.accent }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CATEGORY */}
          <View style={s.catSection}>
            <Text style={s.catLabel}>CATEGORY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.catScroll}
            >
              {allCategories.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  cat={cat}
                  selected={category === cat.id}
                  onPress={() => setCategory(cat.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* NOTE (optional) */}
          <InputField
            label="Note (Optional)"
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Buy 2 get 1 free"
            multiline
          />

          {/* PRICE SUMMARY CARD */}
          {parseFloat(price) > 0 && (
            <View style={s.summaryCard}>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Unit Price</Text>
                <Text style={s.summaryVal}>{sym} {parseFloat(price).toFixed(2)}</Text>
              </View>
              {parseFloat(discount) > 0 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryKey}>Discount ({discount}%)</Text>
                  <Text style={[s.summaryVal, { color: T.success }]}>
                    − {sym} {(parseFloat(price) - discountedPrice).toFixed(2)}
                  </Text>
                </View>
              )}
              {parseInt(quantity) > 1 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryKey}>Qty × {quantity}</Text>
                  <Text style={s.summaryVal}>{sym} {discountedPrice.toFixed(2)} each</Text>
                </View>
              )}
              <View style={[s.summaryRow, s.summaryTotal]}>
                <Text style={s.summaryTotalKey}>Total</Text>
                <Text style={s.summaryTotalVal}>{sym} {finalTotal.toFixed(2)}</Text>
              </View>
            </View>
          )}

          {/* ADD BUTTON */}
          <Animated.View style={[s.addBtnWrap, { transform: [{ scale: btnScale }] }]}>
            <TouchableOpacity
              style={[
                s.addBtn,
                isValid
                  ? { backgroundColor: T.accent }
                  : { backgroundColor: T.disabled },
              ]}
              onPress={handleAdd}
              disabled={!isValid}
              activeOpacity={0.88}
            >
              <Text
                style={[
                  s.addBtnTxt,
                  { color: isValid ? T.white : T.disabledText },
                ]}
              >
                Add to Cart
              </Text>
              {isValid && (
                <View style={s.addBtnBadge}>
                  <Text style={s.addBtnBadgeTxt}>
                    {sym} {finalTotal.toFixed(0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 20 }} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      {/* BOTTOM NAV */}
      {/* <BottomNav activeTab={activeTab} onTabPress={setActiveTab} /> */}

      {/* SUCCESS POPUP */}
      {/* BOTTOM NAV */}
      <View style={s.footerTabBar}>
        {/* Home */}
        <TouchableOpacity
          style={s.tabButton}
          onPress={() => router.push('/home')}
        >
          <LayoutGrid size={24} color="#9CA3AF" />
          <Text style={s.tabLabel}>Home</Text>
        </TouchableOpacity>

        {/* Scan */}
        <TouchableOpacity
          style={s.tabButton}
          onPress={() => router.push('/Scan')}
        >
          <Scan size={24} color="#9CA3AF" />
          <Text style={s.tabLabel}>Scan</Text>
        </TouchableOpacity>

        {/* Add */}
        <TouchableOpacity
          style={s.tabButton}
          activeOpacity={1}
        >
          <View style={s.activeTabIconContainer}>
            <PlusCircle size={24} color="#E65F2B" />
          </View>
          <Text style={[s.tabLabel, s.activeTabLabel]}>
            Add
          </Text>
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity
          style={s.tabButton}
          onPress={() => router.push('/Scan?tab=cart')}
          activeOpacity={0.7}
        >
          <ShoppingBag size={24} color="#9CA3AF" />
          <Text style={s.tabLabel}>Cart</Text>
        </TouchableOpacity>

        {/* Budget */}
        <TouchableOpacity
          style={s.tabButton}
          onPress={() => router.push('/budget')}
        >
          <PieChart size={24} color="#9CA3AF" />
          <Text style={s.tabLabel}>Budget</Text>
        </TouchableOpacity>
      </View>

      {/* VOICE MODAL (for Expo Go keyboard dictation) */}
      <VoiceModal
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSubmit={handleFinalTranscript}
      />

      {/* SUCCESS POPUP */}
      {addedItem && (
        <SuccessPopup
          visible={showSuccess}
          itemName={addedItem.name}
          price={addedItem.price}
          currencySymbol={currency?.symbol || '$'}
          onHide={() => {
            setShowSuccess(false);
            setAddedItem(null);
          }}
        />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 42,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: T.bg,
    shadowColor: '#000',
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: T.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: T.text, lineHeight: 24 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: T.text,
    letterSpacing: 0.2,
  },
  headerRight: { width: 38 },

  // Scroll
  scroll: { flex: 1, backgroundColor: T.bg },
  scrollContent: { paddingTop: 4, paddingBottom: 12 },

  // Section gap
  sectionGap: { height: 6 },

  // Row layout (price + discount)
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: -14, // fields have own bottom margin
  },

  // Quantity
  qtyWrap: { marginHorizontal: 16, marginBottom: 14 },
  qtyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: T.textSub,
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.white,
  },
  qtyBtnTxt: {
    fontSize: 22,
    fontWeight: '600',
    color: T.textSub,
    lineHeight: 26,
  },
  qtyInput: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.white,
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
    textAlign: 'center',
  },

  // Category
  catSection: { marginBottom: 14 },
  catLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: T.textSub,
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: 'uppercase',
    marginHorizontal: 16,
  },
  catScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },

  // Price summary card
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: T.accentSofter,
    borderWidth: 1.5,
    borderColor: T.voiceBorder,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryKey: { fontSize: 13, color: T.textSub, fontWeight: '500' },
  summaryVal: { fontSize: 13, color: T.text, fontWeight: '600' },
  summaryTotal: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.voiceBorder,
  },
  summaryTotalKey: {
    fontSize: 15,
    color: T.text,
    fontWeight: '700',
  },
  summaryTotalVal: {
    fontSize: 18,
    color: T.accent,
    fontWeight: '900',
  },

  // Add button
  addBtnWrap: {
    marginHorizontal: 16,
    marginBottom: 6,
    shadowColor: T.accent,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  addBtn: {
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addBtnTxt: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  addBtnBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  addBtnBadgeTxt: {
    color: T.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footerTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 72,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTabIconContainer: {
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#E65F2B',
    fontWeight: '700',
    marginTop: 0,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
});