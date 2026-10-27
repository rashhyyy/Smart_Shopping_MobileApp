import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
} from 'react-native';
import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Search,
    X,
    ShoppingBag,
    Calendar,
    ChevronDown,
    ChevronUp,
    Store,
    TrendingDown,
    CheckCircle2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

type OrderItem = {
    name: string;
    qty: number;
    price: number;
};

type ShoppingOrder = {
    id: string;
    storeName: string;
    storeCategory: string;
    storeIconColor: string;
    date: string;
    totalAmount: number;
    savingsAmount: number;
    itemsCount: number;
    status: 'Completed' | 'Processing';
    items: OrderItem[];
};

const ORDERS_DATA: ShoppingOrder[] = [
    {
        id: 'ORD-9821',
        storeName: 'Fresh Market Supermarket',
        storeCategory: 'Supermarket',
        storeIconColor: '#10B981',
        date: 'Oct 24, 2026',
        totalAmount: 54.20,
        savingsAmount: 12.50,
        itemsCount: 4,
        status: 'Completed',
        items: [
            { name: 'Organic Almond Milk 1L', qty: 2, price: 7.60 },
            { name: 'Fresh Hass Avocados (Pack of 4)', qty: 1, price: 5.40 },
            { name: 'Greek Honey Yogurt 500g', qty: 2, price: 8.20 },
            { name: 'Artisan Sourdough Loaf', qty: 1, price: 4.80 },
        ],
    },
    {
        id: 'ORD-9745',
        storeName: 'TechZone Electronics',
        storeCategory: 'Electronics',
        storeIconColor: '#3B82F6',
        date: 'Oct 19, 2026',
        totalAmount: 149.99,
        savingsAmount: 30.00,
        itemsCount: 2,
        status: 'Completed',
        items: [
            { name: 'Anker Fast Wireless Charger Pad', qty: 1, price: 39.99 },
            { name: 'Braided USB-C Cable Pack (3m)', qty: 2, price: 24.99 },
        ],
    },
    {
        id: 'ORD-9612',
        storeName: 'Green Grocery & Deli',
        storeCategory: 'Supermarket',
        storeIconColor: '#10B981',
        date: 'Oct 14, 2026',
        totalAmount: 78.40,
        savingsAmount: 15.20,
        itemsCount: 5,
        status: 'Completed',
        items: [
            { name: 'Extra Virgin Olive Oil 750ml', qty: 1, price: 14.50 },
            { name: 'Organic Roma Tomatoes 1kg', qty: 1, price: 4.20 },
            { name: 'Atlantic Salmon Fillet 400g', qty: 1, price: 16.80 },
            { name: 'Parmigiano Reggiano Wedge', qty: 1, price: 9.90 },
            { name: 'Spaghetti Pasta 500g', qty: 3, price: 6.00 },
        ],
    },
    {
        id: 'ORD-9530',
        storeName: 'Urban Fashion & Apparel',
        storeCategory: 'Clothing',
        storeIconColor: '#EC4899',
        date: 'Oct 08, 2026',
        totalAmount: 120.00,
        savingsAmount: 25.00,
        itemsCount: 3,
        status: 'Completed',
        items: [
            { name: 'Premium Cotton Crew Tee', qty: 2, price: 38.00 },
            { name: 'Slim Fit Chino Trousers', qty: 1, price: 58.00 },
        ],
    },
    {
        id: 'ORD-9418',
        storeName: 'PharmaPlus Health Care',
        storeCategory: 'Health',
        storeIconColor: '#F59E0B',
        date: 'Sep 28, 2026',
        totalAmount: 32.60,
        savingsAmount: 4.50,
        itemsCount: 2,
        status: 'Completed',
        items: [
            { name: 'Vitamin C 1000mg Effervescent', qty: 1, price: 12.80 },
            { name: 'Daily Hydration Electrolytes', qty: 1, price: 15.30 },
        ],
    },
];

const CATEGORIES = ['All', 'Supermarket', 'Electronics', 'Clothing', 'Health'];

export default function ShoppingHistoryScreen() {
    const router = useRouter();
    const { currency } = useUser();
    const sym = currency?.symbol || '$';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const toggleExpandOrder = (id: string) => {
        setExpandedOrderId(prev => (prev === id ? null : id));
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/profile');
        }
    };

    // Filter orders
    const filteredOrders = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return ORDERS_DATA.filter((order) => {
            const matchesCat = selectedCategory === 'All' || order.storeCategory === selectedCategory;
            const matchesQuery =
                !query ||
                order.storeName.toLowerCase().includes(query) ||
                order.id.toLowerCase().includes(query) ||
                order.items.some(item => item.name.toLowerCase().includes(query));
            return matchesCat && matchesQuery;
        });
    }, [searchQuery, selectedCategory]);

    // Calculate totals
    const totalSpent = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalSaved = filteredOrders.reduce((sum, o) => sum + o.savingsAmount, 0);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.roundButton}
                        activeOpacity={0.7}
                        onPress={handleBack}
                    >
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Shopping History</Text>

                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Summary Overview Card */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryTopRow}>
                            <View>
                                <Text style={styles.summaryLabel}>TOTAL SPENT</Text>
                                <Text style={styles.summaryAmount}>
                                    {sym}{totalSpent.toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.savingsBadge}>
                                <TrendingDown size={14} color="#15803D" style={{ marginRight: 4 }} />
                                <Text style={styles.savingsBadgeText}>
                                    Saved {sym}{totalSaved.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.summaryDivider} />

                        <View style={styles.summaryStatsRow}>
                            <View style={styles.summaryStatItem}>
                                <Text style={styles.statNumber}>{filteredOrders.length}</Text>
                                <Text style={styles.statLabel}>Total Trips</Text>
                            </View>
                            <View style={styles.statSeparator} />
                            <View style={styles.summaryStatItem}>
                                <Text style={styles.statNumber}>
                                    {filteredOrders.reduce((sum, o) => sum + o.itemsCount, 0)}
                                </Text>
                                <Text style={styles.statLabel}>Items Bought</Text>
                            </View>
                            <View style={styles.statSeparator} />
                            <View style={styles.summaryStatItem}>
                                <Text style={[styles.statNumber, { color: '#E65F2B' }]}>
                                    {totalSpent > 0 ? ((totalSaved / (totalSpent + totalSaved)) * 100).toFixed(0) : 0}%
                                </Text>
                                <Text style={styles.statLabel}>Avg Discount</Text>
                            </View>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchWrapper}>
                        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search store, item, or receipt ID..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Category Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryRow}
                    >
                        {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                                    activeOpacity={0.7}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            isSelected && styles.categoryChipTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Orders List */}
                    <View style={styles.ordersListContainer}>
                        <Text style={styles.sectionTitle}>
                            Recent Receipts ({filteredOrders.length})
                        </Text>

                        {filteredOrders.length === 0 ? (
                            <View style={styles.emptyState}>
                                <ShoppingBag size={48} color="#D1D5DB" />
                                <Text style={styles.emptyTitle}>No orders found</Text>
                                <Text style={styles.emptySubtitle}>
                                    No receipts matched your search or category filter.
                                </Text>
                            </View>
                        ) : (
                            filteredOrders.map((order) => {
                                const isExpanded = expandedOrderId === order.id;

                                return (
                                    <View key={order.id} style={styles.orderCard}>
                                        <TouchableOpacity
                                            style={styles.orderCardHeader}
                                            activeOpacity={0.7}
                                            onPress={() => toggleExpandOrder(order.id)}
                                        >
                                            <View
                                                style={[
                                                    styles.storeIconCircle,
                                                    { backgroundColor: `${order.storeIconColor}15` },
                                                ]}
                                            >
                                                <Store size={20} color={order.storeIconColor} />
                                            </View>

                                            <View style={styles.orderMainDetails}>
                                                <View style={styles.orderTopTitleRow}>
                                                    <Text style={styles.storeNameText} numberOfLines={1}>
                                                        {order.storeName}
                                                    </Text>
                                                    <Text style={styles.orderPriceText}>
                                                        {sym}{order.totalAmount.toFixed(2)}
                                                    </Text>
                                                </View>

                                                <View style={styles.orderSubRow}>
                                                    <View style={styles.dateRow}>
                                                        <Calendar size={12} color="#9CA3AF" style={{ marginRight: 4 }} />
                                                        <Text style={styles.dateText}>{order.date}</Text>
                                                        <Text style={styles.dotSeparator}>•</Text>
                                                        <Text style={styles.itemsCountText}>{order.itemsCount} items</Text>
                                                    </View>
                                                    <Text style={styles.orderSavedText}>
                                                        Saved {sym}{order.savingsAmount.toFixed(2)}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.expandChevron}>
                                                {isExpanded ? (
                                                    <ChevronUp size={18} color="#6B7280" />
                                                ) : (
                                                    <ChevronDown size={18} color="#6B7280" />
                                                )}
                                            </View>
                                        </TouchableOpacity>

                                        {/* Expanded Item Breakdown */}
                                        {isExpanded && (
                                            <View style={styles.expandedItemsContainer}>
                                                <View style={styles.expandedDivider} />
                                                <Text style={styles.breakdownHeader}>PURCHASED ITEMS</Text>
                                                {order.items.map((item, idx) => (
                                                    <View key={idx} style={styles.itemRow}>
                                                        <View style={styles.itemRowLeft}>
                                                            <CheckCircle2 size={14} color="#10B981" style={{ marginRight: 8 }} />
                                                            <Text style={styles.itemNameText}>{item.name}</Text>
                                                        </View>
                                                        <View style={styles.itemRowRight}>
                                                            <Text style={styles.itemQtyText}>x{item.qty}</Text>
                                                            <Text style={styles.itemPriceText}>
                                                                {sym}{item.price.toFixed(2)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                ))}

                                                <View style={styles.receiptFooter}>
                                                    <Text style={styles.receiptIdText}>Receipt ID: {order.id}</Text>
                                                    <View style={styles.completedBadge}>
                                                        <Text style={styles.completedBadgeText}>Verified Receipt</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    summaryCard: {
        backgroundColor: '#1E293B',
        borderRadius: 22,
        padding: 20,
        marginTop: 6,
        marginBottom: 16,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 5,
    },
    summaryTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    savingsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    savingsBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#15803D',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 16,
    },
    summaryStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryStatItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    statSeparator: {
        width: 1,
        height: 24,
        backgroundColor: '#334155',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 14,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    categoryRow: {
        paddingBottom: 14,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
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
    ordersListContainer: {
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    orderCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    orderMainDetails: {
        flex: 1,
    },
    orderTopTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    storeNameText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
    },
    orderPriceText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    orderSubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
    },
    dotSeparator: {
        fontSize: 12,
        color: '#9CA3AF',
        marginHorizontal: 6,
    },
    itemsCountText: {
        fontSize: 12,
        color: '#6B7280',
    },
    orderSavedText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#15803D',
    },
    expandChevron: {
        marginLeft: 8,
    },
    expandedItemsContainer: {
        marginTop: 14,
    },
    expandedDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    breakdownHeader: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.6,
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    itemRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    itemNameText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },
    itemRowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemQtyText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    itemPriceText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
    },
    receiptFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    receiptIdText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontFamily: 'monospace',
    },
    completedBadge: {
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    completedBadgeText: {
        fontSize: 11,
        color: '#16A34A',
        fontWeight: '700',
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginTop: 12,
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        maxWidth: 260,
    },
});
