import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
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
    Scan,
    Barcode,
    TrendingDown,
    Heart,
    Share2,
    Store,
    CheckCircle2,
    Clock,
    Sparkles,
    ExternalLink,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

type ScannedProduct = {
    id: string;
    name: string;
    brand: string;
    barcode: string;
    category: 'Groceries' | 'Electronics' | 'Personal Care' | 'Beverages';
    scannedDate: string;
    bestPrice: number;
    originalPrice: number;
    bestStore: string;
    alternativeStore: string;
    alternativePrice: number;
    priceDrop: boolean;
    dropPercentage?: number;
    isFavorite: boolean;
};

const INITIAL_SCANS: ScannedProduct[] = [
    {
        id: 'SCN-101',
        name: 'Organic Extra Virgin Olive Oil 750ml',
        brand: 'Filippo Berio',
        barcode: '018475001293',
        category: 'Groceries',
        scannedDate: 'Today, 2:45 PM',
        bestPrice: 11.99,
        originalPrice: 15.49,
        bestStore: 'Costco Wholesale',
        alternativeStore: 'Whole Foods',
        alternativePrice: 15.49,
        priceDrop: true,
        dropPercentage: 22,
        isFavorite: true,
    },
    {
        id: 'SCN-102',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        brand: 'Sony',
        barcode: '027242923164',
        category: 'Electronics',
        scannedDate: 'Yesterday, 6:12 PM',
        bestPrice: 329.99,
        originalPrice: 399.99,
        bestStore: 'Amazon Deals',
        alternativeStore: 'Best Buy',
        alternativePrice: 379.99,
        priceDrop: true,
        dropPercentage: 18,
        isFavorite: true,
    },
    {
        id: 'SCN-103',
        name: 'Greek Whole Milk Yogurt Plain 32oz',
        brand: 'Chobani',
        barcode: '894700010042',
        category: 'Groceries',
        scannedDate: 'Oct 23, 11:30 AM',
        bestPrice: 4.89,
        originalPrice: 5.99,
        bestStore: 'Trader Joe\'s',
        alternativeStore: 'Safeway',
        alternativePrice: 5.99,
        priceDrop: true,
        dropPercentage: 18,
        isFavorite: false,
    },
    {
        id: 'SCN-104',
        name: 'CeraVe Hydrating Facial Cleanser 16oz',
        brand: 'CeraVe Skincare',
        barcode: '360600053773',
        category: 'Personal Care',
        scannedDate: 'Oct 21, 4:15 PM',
        bestPrice: 14.29,
        originalPrice: 17.99,
        bestStore: 'Target Store',
        alternativeStore: 'CVS Pharmacy',
        alternativePrice: 18.49,
        priceDrop: true,
        dropPercentage: 20,
        isFavorite: false,
    },
    {
        id: 'SCN-105',
        name: 'Cold Pressed 100% Orange Juice 52oz',
        brand: 'Simply Orange',
        barcode: '025000044021',
        category: 'Beverages',
        scannedDate: 'Oct 20, 10:05 AM',
        bestPrice: 4.49,
        originalPrice: 4.99,
        bestStore: 'Kroger Supermarket',
        alternativeStore: 'Walmart',
        alternativePrice: 4.79,
        priceDrop: false,
        isFavorite: false,
    },
    {
        id: 'SCN-106',
        name: 'Anker PowerCore 20K Portable Charger',
        brand: 'Anker Innovation',
        barcode: '848061002341',
        category: 'Electronics',
        scannedDate: 'Oct 18, 1:20 PM',
        bestPrice: 39.99,
        originalPrice: 49.99,
        bestStore: 'Newegg Tech',
        alternativeStore: 'Target',
        alternativePrice: 49.99,
        priceDrop: true,
        dropPercentage: 20,
        isFavorite: true,
    },
    {
        id: 'SCN-107',
        name: 'San Pellegrino Sparkling Mineral Water 1L',
        brand: 'S.Pellegrino',
        barcode: '041508800043',
        category: 'Beverages',
        scannedDate: 'Oct 16, 5:40 PM',
        bestPrice: 2.19,
        originalPrice: 2.79,
        bestStore: 'Aldi Market',
        alternativeStore: 'Whole Foods',
        alternativePrice: 2.99,
        priceDrop: true,
        dropPercentage: 21,
        isFavorite: false,
    },
];

const CATEGORIES = ['All', 'Price Drops', 'Favorites', 'Groceries', 'Electronics', 'Personal Care', 'Beverages'];

export default function MyScansScreen() {
    const router = useRouter();
    const { currency } = useUser();
    const sym = currency?.symbol || '$';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [scansList, setScansList] = useState<ScannedProduct[]>(INITIAL_SCANS);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/profile');
        }
    };

    const toggleFavorite = (id: string) => {
        setScansList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
    };

    const filteredScans = useMemo(() => {
        return scansList.filter(item => {
            const matchesCategory =
                selectedCategory === 'All'
                    ? true
                    : selectedCategory === 'Price Drops'
                        ? item.priceDrop
                        : selectedCategory === 'Favorites'
                            ? item.isFavorite
                            : item.category === selectedCategory;

            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.brand.toLowerCase().includes(q) ||
                item.barcode.includes(q) ||
                item.bestStore.toLowerCase().includes(q);

            return matchesCategory && matchesSearch;
        });
    }, [scansList, selectedCategory, searchQuery]);

    // Statistics calculated dynamically
    const totalScansCount = 847; // Matches user profile stat
    const priceDropsCount = scansList.filter(s => s.priceDrop).length;
    const totalPotentialSavings = scansList.reduce(
        (sum, item) => sum + (item.originalPrice - item.bestPrice),
        0
    );

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
                        <Text style={styles.headerTitle}>My Scans</Text>
                        <Text style={styles.headerSubtitle}>
                            {scansList.length} recent • 847 total scans
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.scanCtaButton}
                        onPress={() => router.push('/Scan')}
                        activeOpacity={0.8}
                    >
                        <Scan size={16} color="#FFFFFF" />
                        <Text style={styles.scanCtaText}>Scan</Text>
                    </TouchableOpacity>
                </View>

                {/* ================= SEARCH BAR ================= */}
                <View style={styles.searchWrapper}>
                    <View style={styles.searchBar}>
                        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by product, brand, or barcode..."
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
                    {/* ================= STATS OVERVIEW CARD ================= */}
                    <View style={styles.statsCard}>
                        <View style={styles.statsHeader}>
                            <View style={styles.statsHeaderIconWrapper}>
                                <Barcode size={20} color="#E65F2B" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.statsCardTitle}>Smart Price Tracker</Text>
                                <Text style={styles.statsCardSubtitle}>
                                    Real-time barcode matches across 50+ stores
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statsDivider} />

                        <View style={styles.statsRow}>
                            <View style={styles.statCol}>
                                <Text style={styles.statNumber}>{totalScansCount}</Text>
                                <Text style={styles.statLabel}>Total Scans</Text>
                            </View>

                            <View style={styles.statVerticalDivider} />

                            <View style={styles.statCol}>
                                <View style={styles.statWithBadge}>
                                    <Text style={[styles.statNumber, { color: '#10B981' }]}>
                                        {priceDropsCount}
                                    </Text>
                                    <TrendingDown size={14} color="#10B981" style={{ marginLeft: 3 }} />
                                </View>
                                <Text style={styles.statLabel}>Price Drops</Text>
                            </View>

                            <View style={styles.statVerticalDivider} />

                            <View style={styles.statCol}>
                                <Text style={[styles.statNumber, { color: '#E65F2B' }]}>
                                    {sym}{totalPotentialSavings.toFixed(2)}
                                </Text>
                                <Text style={styles.statLabel}>Savings Found</Text>
                            </View>
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
                            Scanned Items ({filteredScans.length})
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            Sorted by latest scan
                        </Text>
                    </View>

                    {/* ================= EMPTY STATE ================= */}
                    {filteredScans.length === 0 && (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <Scan size={36} color="#9CA3AF" />
                            </View>
                            <Text style={styles.emptyTitle}>No Scanned Items Found</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery
                                    ? `No results matching "${searchQuery}". Try a different keyword.`
                                    : 'Scan barcodes while in store to compare real-time prices.'}
                            </Text>
                            {searchQuery ? (
                                <TouchableOpacity
                                    style={styles.clearSearchBtn}
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                    }}
                                >
                                    <Text style={styles.clearSearchBtnText}>Reset Filter</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.startScanBtn}
                                    onPress={() => router.push('/Scan')}
                                >
                                    <Scan size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.startScanBtnText}>Scan a Barcode</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* ================= SCANS LIST ================= */}
                    {filteredScans.map(item => (
                        <View key={item.id} style={styles.productCard}>
                            {/* TOP ROW: Brand, Barcode, Favorite */}
                            <View style={styles.productCardTop}>
                                <View style={styles.productBrandBadge}>
                                    <Text style={styles.productBrandText}>{item.brand}</Text>
                                </View>

                                <View style={styles.barcodeBadge}>
                                    <Barcode size={12} color="#6B7280" />
                                    <Text style={styles.barcodeText}>{item.barcode}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.favoriteButton}
                                    onPress={() => toggleFavorite(item.id)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Heart
                                        size={18}
                                        color={item.isFavorite ? '#EF4444' : '#9CA3AF'}
                                        fill={item.isFavorite ? '#EF4444' : 'transparent'}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* PRODUCT TITLE */}
                            <Text style={styles.productName}>{item.name}</Text>

                            {/* TIMESTAMP */}
                            <View style={styles.timestampRow}>
                                <Clock size={12} color="#9CA3AF" />
                                <Text style={styles.timestampText}>{item.scannedDate}</Text>
                            </View>

                            {/* PRICE HIGHLIGHT CARD */}
                            <View style={styles.priceContainer}>
                                <View style={styles.bestPriceCol}>
                                    <View style={styles.bestPriceHeader}>
                                        <Text style={styles.bestPriceLabel}>BEST PRICE</Text>
                                        {item.priceDrop && (
                                            <View style={styles.dropBadge}>
                                                <TrendingDown size={11} color="#047857" />
                                                <Text style={styles.dropBadgeText}>
                                                    -{item.dropPercentage}% DROP
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.priceRow}>
                                        <Text style={styles.bestPriceValue}>
                                            {sym}{item.bestPrice.toFixed(2)}
                                        </Text>
                                        {item.originalPrice > item.bestPrice && (
                                            <Text style={styles.originalPriceValue}>
                                                {sym}{item.originalPrice.toFixed(2)}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.storeRow}>
                                        <Store size={13} color="#10B981" />
                                        <Text style={styles.storeNameText}>{item.bestStore}</Text>
                                    </View>
                                </View>

                                {/* VS ALTERNATIVE STORE */}
                                <View style={styles.comparisonCol}>
                                    <Text style={styles.comparisonLabel}>Other Store</Text>
                                    <Text style={styles.altPriceValue}>
                                        {sym}{item.alternativePrice.toFixed(2)}
                                    </Text>
                                    <Text style={styles.altStoreText} numberOfLines={1}>
                                        {item.alternativeStore}
                                    </Text>
                                    <Text style={styles.savingDiffText}>
                                        Save {sym}{(item.alternativePrice - item.bestPrice).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* ACTION BUTTONS */}
                            <View style={styles.cardActionsRow}>
                                <TouchableOpacity
                                    style={styles.viewDealBtn}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        Alert.alert(
                                            item.name,
                                            `Best deal available at ${item.bestStore} for ${sym}${item.bestPrice.toFixed(2)}.\nBarcode: ${item.barcode}`,
                                            [{ text: 'OK' }]
                                        )
                                    }
                                >
                                    <Text style={styles.viewDealBtnText}>Compare All Deals</Text>
                                    <ExternalLink size={13} color="#E65F2B" style={{ marginLeft: 4 }} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.rescanBtn}
                                    onPress={() => router.push('/Scan')}
                                    activeOpacity={0.7}
                                >
                                    <Scan size={14} color="#6B7280" />
                                    <Text style={styles.rescanBtnText}>Re-scan</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <View style={{ height: 40 }} />
                </ScrollView>
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
    scanCtaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E65F2B',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#E65F2B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    scanCtaText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 5,
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
    statsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginTop: 6,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        shadowColor: '#E65F2B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsHeaderIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FFF0EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statsCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    statsCardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    statsDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 14,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statCol: {
        flex: 1,
        alignItems: 'center',
    },
    statWithBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 19,
        fontWeight: '800',
        color: '#1F2937',
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 4,
        fontWeight: '500',
    },
    statVerticalDivider: {
        width: 1,
        height: 28,
        backgroundColor: '#E5E7EB',
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
    clearSearchBtn: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        backgroundColor: '#FFF0EA',
        borderRadius: 12,
    },
    clearSearchBtnText: {
        color: '#E65F2B',
        fontWeight: '600',
        fontSize: 13,
    },
    startScanBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 11,
        backgroundColor: '#E65F2B',
        borderRadius: 14,
    },
    startScanBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    productCard: {
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
    },
    productCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    productBrandBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    productBrandText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4B5563',
    },
    barcodeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginLeft: 8,
        flex: 1,
    },
    barcodeText: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: '#6B7280',
        marginLeft: 4,
    },
    favoriteButton: {
        padding: 4,
        marginLeft: 8,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        lineHeight: 20,
        marginBottom: 6,
    },
    timestampRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    timestampText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginLeft: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    bestPriceCol: {
        flex: 1.4,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        paddingRight: 10,
    },
    bestPriceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    bestPriceLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 0.5,
    },
    dropBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    dropBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#065F46',
        marginLeft: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    bestPriceValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    originalPriceValue: {
        fontSize: 13,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginLeft: 6,
    },
    storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeNameText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#065F46',
        marginLeft: 4,
    },
    comparisonCol: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'center',
    },
    comparisonLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 2,
    },
    altPriceValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4B5563',
    },
    altStoreText: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 1,
    },
    savingDiffText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#E65F2B',
        marginTop: 2,
    },
    cardActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 4,
    },
    viewDealBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0EA',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
    },
    viewDealBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#E65F2B',
    },
    rescanBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 10,
    },
    rescanBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 4,
    },
});
