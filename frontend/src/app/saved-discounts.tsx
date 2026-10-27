import React, { useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Clipboard,
    Alert,
} from 'react-native';
import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Search,
    X,
    Tag,
    Clock,
    Copy,
    Check,
    Store,
    Barcode,
    QrCode,
    Sparkles,
    Calendar,
    Percent,
    ExternalLink,
    AlertCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

type DiscountItem = {
    id: string;
    storeName: string;
    storeCategory: 'Groceries' | 'Electronics' | 'Fashion' | 'Dining';
    title: string;
    discountType: 'percentage' | 'fixed' | 'bogo';
    discountValue: string;
    estimatedSavings: number;
    code: string;
    expiresIn: string;
    isExpiringSoon: boolean;
    minSpend: number;
    terms: string;
    barcodeNumber: string;
};

const DISCOUNTS_DATA: DiscountItem[] = [
    {
        id: 'DSC-01',
        storeName: 'Whole Foods Market',
        storeCategory: 'Groceries',
        title: '25% Off Fresh Organic Produce',
        discountType: 'percentage',
        discountValue: '25% OFF',
        estimatedSavings: 15.00,
        code: 'ORGANIC25',
        expiresIn: 'Expires tomorrow',
        isExpiringSoon: true,
        minSpend: 40.00,
        terms: 'Valid on certified organic vegetables and fruits. In-store and pickup.',
        barcodeNumber: '89102456012',
    },
    {
        id: 'DSC-02',
        storeName: 'Best Buy Electronics',
        storeCategory: 'Electronics',
        title: '$50 Off Audio & Headphones',
        discountType: 'fixed',
        discountValue: '$50 OFF',
        estimatedSavings: 50.00,
        code: 'AUDIO50SAVE',
        expiresIn: 'Expires in 3 days',
        isExpiringSoon: true,
        minSpend: 200.00,
        terms: 'Applies to Sony, Bose, and JBL premium wireless noise-canceling headphones.',
        barcodeNumber: '99210438192',
    },
    {
        id: 'DSC-03',
        storeName: 'Target Supercenter',
        storeCategory: 'Groceries',
        title: '$10 Off Pantry Essentials',
        discountType: 'fixed',
        discountValue: '$10 OFF',
        estimatedSavings: 10.00,
        code: 'PANTRY10',
        expiresIn: 'Valid until Nov 15',
        isExpiringSoon: false,
        minSpend: 50.00,
        terms: 'Valid on pasta, sauces, canned goods, breakfast cereal, and cooking oils.',
        barcodeNumber: '78291038472',
    },
    {
        id: 'DSC-04',
        storeName: 'Nike Official Store',
        storeCategory: 'Fashion',
        title: '20% Off Running Shoes & Apparel',
        discountType: 'percentage',
        discountValue: '20% OFF',
        estimatedSavings: 35.00,
        code: 'RUNFAST20',
        expiresIn: 'Valid until Nov 20',
        isExpiringSoon: false,
        minSpend: 100.00,
        terms: 'Valid on all Pegasus and Infinity line footwear. One redemption per member.',
        barcodeNumber: '44592019384',
    },
    {
        id: 'DSC-05',
        storeName: 'Trader Joe\'s Grocery',
        storeCategory: 'Groceries',
        title: 'Buy 1 Get 1 50% Off Artisanal Bakery',
        discountType: 'bogo',
        discountValue: 'BOGO 50%',
        estimatedSavings: 6.50,
        code: 'BAKERYBOGO',
        expiresIn: 'Expires in 4 days',
        isExpiringSoon: true,
        minSpend: 15.00,
        terms: 'Applies to freshly baked sourdough, brioche, croissants, and baguettes.',
        barcodeNumber: '55102948372',
    },
    {
        id: 'DSC-06',
        storeName: 'Starbucks Coffee',
        storeCategory: 'Dining',
        title: '$5 Off Handcrafted Beverages & Pastry',
        discountType: 'fixed',
        discountValue: '$5 OFF',
        estimatedSavings: 5.00,
        code: 'FALLCOFFEE5',
        expiresIn: 'Valid until Nov 10',
        isExpiringSoon: false,
        minSpend: 15.00,
        terms: 'Order ahead in app or show barcode at register. Excludes merchandise.',
        barcodeNumber: '33491028471',
    },
    {
        id: 'DSC-07',
        storeName: 'Sephora Beauty',
        storeCategory: 'Fashion',
        title: '15% Off Skincare Favorites',
        discountType: 'percentage',
        discountValue: '15% OFF',
        estimatedSavings: 18.50,
        code: 'GLOWSKIN15',
        expiresIn: 'Valid until Nov 30',
        isExpiringSoon: false,
        minSpend: 60.00,
        terms: 'Valid on moisturizers, serums, cleansers, and sunscreen sets.',
        barcodeNumber: '66201948271',
    },
    {
        id: 'DSC-08',
        storeName: 'Uber Eats Food Delivery',
        storeCategory: 'Dining',
        title: '$15 Off Dinner Delivery Order',
        discountType: 'fixed',
        discountValue: '$15 OFF',
        estimatedSavings: 15.00,
        code: 'DINNERYUM15',
        expiresIn: 'Expires in 2 days',
        isExpiringSoon: true,
        minSpend: 35.00,
        terms: 'Valid for participating dinner restaurants from 5:00 PM to 10:00 PM.',
        barcodeNumber: '11293847562',
    },
];

const CATEGORIES = ['All', 'Expiring Soon', 'Groceries', 'Electronics', 'Fashion', 'Dining'];

export default function SavedDiscountsScreen() {
    const router = useRouter();
    const { currency } = useUser();
    const sym = currency?.symbol || '$';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
    const [activeBarcodeItem, setActiveBarcodeItem] = useState<DiscountItem | null>(null);
    const [discountsList, setDiscountsList] = useState<DiscountItem[]>([]);

    useEffect(() => {
        let isMounted = true;
        async function loadDiscounts() {
            try {
                const saved = await AsyncStorage.getItem('@app_saved_discounts');
                if (saved && isMounted) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        setDiscountsList(parsed);
                        return;
                    }
                }
            } catch (e) {}
            if (isMounted) setDiscountsList([]);
        }
        loadDiscounts();
        return () => { isMounted = false; };
    }, []);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/profile');
        }
    };

    const handleCopyCode = (id: string, code: string) => {
        Clipboard.setString(code);
        setCopiedCodeId(id);
        setTimeout(() => {
            setCopiedCodeId(null);
        }, 2200);
    };

    const filteredDiscounts = useMemo(() => {
        return discountsList.filter(item => {
            const matchesCategory =
                selectedCategory === 'All'
                    ? true
                    : selectedCategory === 'Expiring Soon'
                        ? item.isExpiringSoon
                        : item.storeCategory === selectedCategory;

            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                item.storeName.toLowerCase().includes(q) ||
                item.title.toLowerCase().includes(q) ||
                item.code.toLowerCase().includes(q);

            return matchesCategory && matchesSearch;
        });
    }, [discountsList, selectedCategory, searchQuery]);

    const totalSavingsAvailable = discountsList.reduce(
        (sum, item) => sum + item.estimatedSavings,
        0
    );
    const expiringSoonCount = discountsList.filter(item => item.isExpiringSoon).length;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                {/* ================= HEADER ================= */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                        activeOpacity={0.7}
                        accessibilityLabel="Go back"
                    >
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Saved Discounts</Text>
                        <Text style={styles.headerSubtitle}>
                            {discountsList.length} active coupons & promo vouchers
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Tag size={14} color="#E65F2B" />
                        <Text style={styles.countBadgeText}>{discountsList.length}</Text>
                    </View>
                </View>

                {/* ================= SEARCH BAR ================= */}
                <View style={styles.searchWrapper}>
                    <View style={styles.searchBar}>
                        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search coupons, stores, or promo codes..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            returnKeyType="search"
                            clearButtonMode="never"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <X size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ================= SAVINGS HERO CARD ================= */}
                    <View style={styles.heroCard}>
                        <View style={styles.heroTopRow}>
                            <View style={styles.heroIconWrapper}>
                                <Sparkles size={22} color="#FFFFFF" />
                            </View>
                            <View style={styles.expiringTag}>
                                <Clock size={12} color="#DC2626" />
                                <Text style={styles.expiringTagText}>
                                    {expiringSoonCount} expiring soon
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.heroLabel}>Total Available Savings</Text>
                        <Text style={styles.heroAmount}>
                            {sym}{totalSavingsAvailable.toFixed(2)}
                        </Text>

                        <View style={styles.heroFooter}>
                            <Text style={styles.heroFooterText}>
                                Ready to redeem at checkout in-store or online
                            </Text>
                        </View>
                    </View>

                    {/* ================= CATEGORY PILLS ================= */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {CATEGORIES.map(category => {
                            const isSelected = selectedCategory === category;
                            return (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryChip,
                                        isSelected && styles.categoryChipActive,
                                    ]}
                                    onPress={() => setSelectedCategory(category)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            isSelected && styles.categoryChipTextActive,
                                        ]}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* ================= SECTION TITLE ================= */}
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>
                            Available Vouchers ({filteredDiscounts.length})
                        </Text>
                        <Text style={styles.sectionSubtitle}>Tap code to copy</Text>
                    </View>

                    {/* ================= EMPTY STATE ================= */}
                    {filteredDiscounts.length === 0 && (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <Tag size={36} color="#9CA3AF" />
                            </View>
                            <Text style={styles.emptyTitle}>
                                {searchQuery || selectedCategory !== 'All' ? 'No Discounts Found' : 'No Saved Discounts Yet'}
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery
                                    ? `No coupons match "${searchQuery}".`
                                    : selectedCategory !== 'All'
                                    ? 'No active coupons in this category right now.'
                                    : 'Saved vouchers and promo codes will appear here.'}
                            </Text>
                            {(searchQuery || selectedCategory !== 'All') && (
                                <TouchableOpacity
                                    style={styles.resetFilterBtn}
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                    }}
                                >
                                    <Text style={styles.resetFilterBtnText}>Reset Filter</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* ================= VOUCHER CARDS ================= */}
                    {filteredDiscounts.map(item => {
                        const isCopied = copiedCodeId === item.id;

                        return (
                            <View key={item.id} style={styles.voucherCard}>
                                {/* TOP ROW: Store, Discount Badge */}
                                <View style={styles.voucherTop}>
                                    <View style={styles.storeBadge}>
                                        <Store size={14} color="#4B5563" />
                                        <Text style={styles.storeBadgeText}>{item.storeName}</Text>
                                    </View>

                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountBadgeText}>
                                            {item.discountValue}
                                        </Text>
                                    </View>
                                </View>

                                {/* TITLE */}
                                <Text style={styles.voucherTitle}>{item.title}</Text>

                                {/* TERMS / MIN SPEND */}
                                <Text style={styles.voucherTerms}>{item.terms}</Text>

                                <View style={styles.voucherMetaRow}>
                                    <Text style={styles.minSpendText}>
                                        Min. spend: {sym}{item.minSpend.toFixed(2)}
                                    </Text>

                                    <View style={styles.expiryBadge}>
                                        <Clock
                                            size={12}
                                            color={item.isExpiringSoon ? '#DC2626' : '#6B7280'}
                                        />
                                        <Text
                                            style={[
                                                styles.expiryText,
                                                item.isExpiringSoon && styles.expiryTextUrgent,
                                            ]}
                                        >
                                            {item.expiresIn}
                                        </Text>
                                    </View>
                                </View>

                                {/* TICKET DIVIDER NOTCHES */}
                                <View style={styles.notchDividerContainer}>
                                    <View style={[styles.notch, styles.notchLeft]} />
                                    <View style={styles.dashedLine} />
                                    <View style={[styles.notch, styles.notchRight]} />
                                </View>

                                {/* BOTTOM ACTIONS: PROMO CODE & IN-STORE BARCODE */}
                                <View style={styles.voucherBottom}>
                                    {/* PROMO CODE BOX */}
                                    <View style={styles.codeBox}>
                                        <Text style={styles.codeText}>{item.code}</Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.copyBtn,
                                                isCopied && styles.copyBtnSuccess,
                                            ]}
                                            onPress={() => handleCopyCode(item.id, item.code)}
                                            activeOpacity={0.8}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check size={14} color="#FFFFFF" />
                                                    <Text style={styles.copyBtnSuccessText}>COPIED</Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={13} color="#E65F2B" />
                                                    <Text style={styles.copyBtnText}>Copy</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    {/* IN-STORE BARCODE BUTTON */}
                                    <TouchableOpacity
                                        style={styles.barcodeCtaBtn}
                                        onPress={() => setActiveBarcodeItem(item)}
                                        activeOpacity={0.8}
                                    >
                                        <Barcode size={16} color="#4B5563" />
                                        <Text style={styles.barcodeCtaText}>In-Store</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}

                    <View style={{ height: 40 }} />
                </ScrollView>

                {/* ================= IN-STORE BARCODE MODAL ================= */}
                <Modal
                    visible={!!activeBarcodeItem}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setActiveBarcodeItem(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <View style={styles.modalHeaderLeft}>
                                    <Barcode size={20} color="#E65F2B" />
                                    <Text style={styles.modalTitle}>In-Store Checkout</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.modalCloseBtn}
                                    onPress={() => setActiveBarcodeItem(null)}
                                >
                                    <X size={18} color="#4B5563" />
                                </TouchableOpacity>
                            </View>

                            {activeBarcodeItem && (
                                <View style={styles.modalBody}>
                                    <Text style={styles.modalStoreName}>
                                        {activeBarcodeItem.storeName}
                                    </Text>
                                    <Text style={styles.modalDealTitle}>
                                        {activeBarcodeItem.discountValue} - {activeBarcodeItem.title}
                                    </Text>

                                    {/* MOCK VISUAL BARCODE */}
                                    <View style={styles.barcodeDisplayBox}>
                                        <View style={styles.mockBarcodeGraphic}>
                                            {Array.from({ length: 32 }).map((_, i) => (
                                                <View
                                                    key={i}
                                                    style={[
                                                        styles.barcodeBar,
                                                        {
                                                            width: (i % 3 === 0 ? 3 : (i % 2 === 0 ? 2 : 1)),
                                                            marginRight: (i % 4 === 0 ? 3 : 2),
                                                            backgroundColor: '#111827',
                                                        },
                                                    ]}
                                                />
                                            ))}
                                        </View>
                                        <Text style={styles.barcodeDigits}>
                                            {activeBarcodeItem.barcodeNumber}
                                        </Text>
                                    </View>

                                    <View style={styles.modalInstructions}>
                                        <AlertCircle size={14} color="#6B7280" />
                                        <Text style={styles.modalInstructionsText}>
                                            Show this barcode to the cashier or scan at self-checkout.
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.doneModalBtn}
                                        onPress={() => setActiveBarcodeItem(null)}
                                    >
                                        <Text style={styles.doneModalBtnText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5F0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 14,
        backgroundColor: '#FFF5F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 14,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0EA',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FED7AA',
    },
    countBadgeText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#E65F2B',
        marginLeft: 4,
    },
    searchWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
        paddingVertical: 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    heroCard: {
        backgroundColor: '#E65F2B',
        borderRadius: 20,
        padding: 20,
        marginTop: 6,
        marginBottom: 16,
        shadowColor: '#E65F2B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 5,
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    heroIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expiringTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    expiringTagText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#DC2626',
        marginLeft: 4,
    },
    heroLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
    },
    heroAmount: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        marginVertical: 4,
    },
    heroFooter: {
        marginTop: 6,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    heroFooterText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    categoriesContainer: {
        paddingVertical: 6,
        marginBottom: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryChipActive: {
        backgroundColor: '#E65F2B',
        borderColor: '#E65F2B',
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 10,
    },
    emptyIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 18,
    },
    resetFilterBtn: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        backgroundColor: '#FFF0EA',
        borderRadius: 12,
    },
    resetFilterBtnText: {
        color: '#E65F2B',
        fontWeight: '600',
        fontSize: 13,
    },
    voucherCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 2,
        overflow: 'hidden',
    },
    voucherTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    storeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    storeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 5,
    },
    discountBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    discountBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#B45309',
    },
    voucherTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
        lineHeight: 22,
    },
    voucherTerms: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
        marginBottom: 10,
    },
    voucherMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    minSpendText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    expiryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expiryText: {
        fontSize: 11,
        color: '#6B7280',
        marginLeft: 4,
        fontWeight: '500',
    },
    expiryTextUrgent: {
        color: '#DC2626',
        fontWeight: '700',
    },
    notchDividerContainer: {
        position: 'relative',
        height: 20,
        marginHorizontal: -16,
        justifyContent: 'center',
        marginBottom: 10,
    },
    dashedLine: {
        height: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        marginHorizontal: 16,
    },
    notch: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FFF5F0',
        top: 2,
    },
    notchLeft: {
        left: -8,
    },
    notchRight: {
        right: -8,
    },
    voucherBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    codeBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 10,
    },
    codeText: {
        fontSize: 13,
        fontWeight: '700',
        fontFamily: 'monospace',
        color: '#1F2937',
        letterSpacing: 0.5,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0EA',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    copyBtnSuccess: {
        backgroundColor: '#10B981',
    },
    copyBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#E65F2B',
        marginLeft: 4,
    },
    copyBtnSuccessText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 4,
    },
    barcodeCtaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
    },
    barcodeCtaText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    modalCloseBtn: {
        padding: 4,
    },
    modalBody: {
        alignItems: 'center',
        paddingTop: 16,
    },
    modalStoreName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    modalDealTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 20,
    },
    barcodeDisplayBox: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        width: '100%',
    },
    mockBarcodeGraphic: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        marginBottom: 10,
    },
    barcodeBar: {
        height: '100%',
        borderRadius: 1,
    },
    barcodeDigits: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: '#374151',
        letterSpacing: 2,
    },
    modalInstructions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
        paddingHorizontal: 12,
    },
    modalInstructionsText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginLeft: 6,
        lineHeight: 16,
    },
    doneModalBtn: {
        width: '100%',
        backgroundColor: '#E65F2B',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
    },
    doneModalBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
