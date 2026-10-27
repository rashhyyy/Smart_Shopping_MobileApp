import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import AddExpenseModal from "../components/AddExpenseModal";
import EditBudgetModal from "../components/EditBudgetModal";
import EditCategoryModal from "../components/EditCategoryModal";

// ✅ Included all used icons including ArrowLeft
import { LayoutGrid, Scan, PlusCircle, ShoppingBag, PieChart, ArrowLeft } from "lucide-react-native";

import { useUser } from "../context/UserContext";

export type CategoryItem = {
    id: string;
    name: string;
    icon: string;
    color: string;
    lightBg: string;
    amount: number;
    itemCount: number;
    isCustom?: boolean;
};

// All 10 standard categories matching AddScreen.tsx
export const STANDARD_CATEGORIES = [
    { id: 'grocery', name: 'Grocery', icon: '🛒', color: '#FF6B00', lightBg: '#FFF0E6' },
    { id: 'beverage', name: 'Beverage', icon: '🥤', color: '#00B8D9', lightBg: '#E6F8FA' },
    { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#F59E0B', lightBg: '#FEF3C7' },
    { id: 'dairy', name: 'Dairy', icon: '🥛', color: '#3B82F6', lightBg: '#EFF6FF' },
    { id: 'produce', name: 'Produce', icon: '🥦', color: '#10B981', lightBg: '#ECFDF5' },
    { id: 'bakery', name: 'Bakery', icon: '🍞', color: '#D97706', lightBg: '#FFFBEB' },
    { id: 'meat', name: 'Meat', icon: '🥩', color: '#EF4444', lightBg: '#FEF2F2' },
    { id: 'personal', name: 'Personal', icon: '🧴', color: '#EC4899', lightBg: '#FDF2F8' },
    { id: 'household', name: 'Household', icon: '🏠', color: '#8B5CF6', lightBg: '#F5F3FF' },
    { id: 'other', name: 'Other', icon: '📦', color: '#6B7280', lightBg: '#F3F4F6' },
];

const STORAGE_KEYS = {
    CUSTOM_CATS: '@app_budget_custom_categories_v2',
    MANUAL_ADJ: '@app_budget_manual_adjustments_v2',
};

// Helper to normalize category strings across AddScreen and voice
const normalizeCategory = (cat?: string): string => {
    if (!cat) return 'grocery';
    const c = cat.trim().toLowerCase();
    if (c === 'groceries' || c === 'grocery') return 'grocery';
    if (c === 'beverages' || c === 'beverage' || c === 'drinks' || c === 'drink') return 'beverage';
    if (c === 'snack' || c === 'snacks') return 'snacks';
    if (c === 'dairy' || c === 'milk') return 'dairy';
    if (c === 'produce' || c === 'fruits' || c === 'vegetables' || c === 'veggies') return 'produce';
    if (c === 'bakery' || c === 'bread') return 'bakery';
    if (c === 'meat' || c === 'meats' || c === 'seafood') return 'meat';
    if (c === 'personal' || c === 'personal care') return 'personal';
    if (c === 'household' || c === 'cleaning') return 'household';
    if (c === 'other' || c === 'others') return 'other';
    return c;
};

export default function BudgetScreen() {
    const router = useRouter();
    const {
        currency: globalCurrency,
        monthlyBudget,
        setMonthlyBudget,
        cartItems,
        customCategories,
        addCustomCategory,
        deleteCustomCategory,
    } = useUser();
    const currency = globalCurrency?.symbol || "$";

    // Budget State synced globally with Home and UserContext
    const budget = monthlyBudget || 0;

    // Modals Visibility State
    const [expenseModalVisible, setExpenseModalVisible] = useState(false);
    const [budgetModalVisible, setBudgetModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    // Selected Category State
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

    // Manual adjustments made through EditCategoryModal
    const [manualAdjustments, setManualAdjustments] = useState<Record<string, number>>({});

    // Restore saved manual adjustments
    useEffect(() => {
        let isMounted = true;
        AsyncStorage.getItem(STORAGE_KEYS.MANUAL_ADJ).then((manualSaved) => {
            if (!isMounted) return;
            if (manualSaved) {
                try {
                    const parsed = JSON.parse(manualSaved);
                    if (parsed && typeof parsed === 'object') setManualAdjustments(parsed);
                } catch (e) {}
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    // Dynamically calculate live spend & item counts from cartItems for each category
    const categories: CategoryItem[] = useMemo(() => {
        const allDefs = [
            ...STANDARD_CATEGORIES,
            ...customCategories.map(c => ({
                id: c.id,
                name: c.name,
                icon: c.icon || '🏷️',
                color: c.color || '#FF6B00',
                lightBg: c.lightBg || 'rgba(255, 107, 0, 0.12)',
                isCustom: true,
            })),
        ];

        return allDefs.map(cat => {
            let cartSpend = 0;
            let itemCount = 0;

            (cartItems || []).forEach(item => {
                const itemCat = normalizeCategory(item.category);
                if (itemCat === cat.id.toLowerCase() || itemCat === cat.name.toLowerCase()) {
                    const p = Number(item.price) || 0;
                    const q = Number(item.quantity) || 1;
                    cartSpend += p * q;
                    itemCount += q;
                }
            });

            const manual = manualAdjustments[cat.id] ?? manualAdjustments[cat.name] ?? 0;
            const totalAmount = Math.max(0, cartSpend + manual);

            return {
                id: cat.id,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                lightBg: cat.lightBg,
                amount: totalAmount,
                itemCount,
                isCustom: 'isCustom' in cat ? Boolean(cat.isCustom) : false,
            };
        });
    }, [cartItems, customCategories, manualAdjustments]);

    // Financial Calculations
    const totalExpenses = useMemo(() => {
        return categories.reduce((total, item) => total + item.amount, 0);
    }, [categories]);

    const activeCategoriesCount = useMemo(() => {
        return categories.filter(c => c.amount > 0 || c.itemCount > 0).length;
    }, [categories]);

    const remainingBudget = Math.max(0, budget - totalExpenses);
    const progress = budget > 0 ? (totalExpenses / budget) * 100 : 0;

    // Weekly spending chart calculations from real cart items
    const weeklyData = useMemo(() => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayIndex = new Date().getDay();
        const orderedDayIndices = [1, 2, 3, 4, 5, 6, 0]; // Mon .. Sun

        const daySpends = orderedDayIndices.map(dayIdx => {
            return {
                day: dayNames[dayIdx],
                amount: 0,
                isToday: dayIdx === todayIndex,
            };
        });

        (cartItems || []).forEach(item => {
            try {
                const itemDate = new Date(item.capturedAt);
                if (!isNaN(itemDate.getTime())) {
                    const dayIdx = itemDate.getDay();
                    const target = daySpends.find(d => d.day === dayNames[dayIdx]);
                    if (target) {
                        target.amount += (Number(item.price) || 0) * (Number(item.quantity) || 1);
                    }
                }
            } catch (e) {}
        });

        const hasAnySpend = daySpends.some(d => d.amount > 0);
        if (!hasAnySpend && totalExpenses > 0) {
            const todayTarget = daySpends.find(d => d.isToday);
            if (todayTarget) {
                todayTarget.amount = totalExpenses;
            }
        }

        const maxSpend = Math.max(...daySpends.map(d => d.amount), 1);

        return daySpends.map(d => ({
            ...d,
            barHeight: totalExpenses > 0 && d.amount > 0
                ? Math.max(26, Math.min(140, Math.round((d.amount / maxSpend) * 140)))
                : 8,
        }));
    }, [cartItems, totalExpenses]);

    // Handle editing category amount
    const handleSaveCategoryAmount = (newAmount: number) => {
        if (!selectedCategory) return;
        const updated = { ...manualAdjustments, [selectedCategory.id]: newAmount };
        setManualAdjustments(updated);
        AsyncStorage.setItem(STORAGE_KEYS.MANUAL_ADJ, JSON.stringify(updated)).catch(() => {});
    };

    // Handle deleting category
    const handleDeleteCategory = () => {
        if (!selectedCategory) return;
        if (selectedCategory.isCustom) {
            deleteCustomCategory(selectedCategory.id);
        }
        const updatedAdj = { ...manualAdjustments };
        delete updatedAdj[selectedCategory.id];
        setManualAdjustments(updatedAdj);
        AsyncStorage.setItem(STORAGE_KEYS.MANUAL_ADJ, JSON.stringify(updatedAdj)).catch(() => {});
    };

    // Handle adding custom category
    const handleAddCategory = (newCat: { name: string; amount: number; color: string; icon?: string }) => {
        const created = addCustomCategory({
            name: newCat.name,
            icon: newCat.icon,
            color: newCat.color,
        });

        if (newCat.amount > 0) {
            const updatedAdj = { ...manualAdjustments, [created.id]: newCat.amount };
            setManualAdjustments(updatedAdj);
            AsyncStorage.setItem(STORAGE_KEYS.MANUAL_ADJ, JSON.stringify(updatedAdj)).catch(() => {});
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

            {/* ─── FIXED TOP SECTION ─── */}
            <View style={styles.fixedTopContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Budget & Analytics</Text>

                    <View style={styles.emptySpace} />
                </View>

                {/* Budget Card */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setBudgetModalVisible(true)}
                >
                    <LinearGradient
                        colors={["#FF8A00", "#FF5E00"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.budgetCard}
                    >
                        <View style={styles.walletCircle}>
                            <Text style={styles.walletIcon}>💳</Text>
                        </View>

                        <Text style={styles.budgetLabel}>MONTHLY BUDGET</Text>

                        <Text style={styles.budgetAmount}>
                            {currency} {budget.toLocaleString()}
                        </Text>

                        {/* Progress */}
                        <View style={styles.progressBackground}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${Math.min(progress, 100)}%` },
                                ]}
                            />
                        </View>

                        <View style={styles.budgetRow}>
                            <Text style={styles.smallText}>
                                {currency} {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} spent
                            </Text>
                            <Text style={styles.smallText}>
                                {currency} {remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} left
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* ─── SCROLLABLE CONTENT SECTION ─── */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Analytics Dashboard Grid */}
                <View style={styles.analyticsRow}>
                    <View style={styles.greenCard}>
                        <View style={styles.smallIconBoxGreen}>
                            <Text style={styles.analyticsIcon}>↓</Text>
                        </View>
                        <Text style={styles.analyticsTitle}>Total Savings</Text>
                        <Text style={styles.analyticsAmount}>
                            {currency} {remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </Text>
                        <Text style={styles.analyticsSubtitle}>
                            {budget > 0 ? `${Math.round((remainingBudget / budget) * 100)}% of budget left` : 'Set budget to track'}
                        </Text>
                    </View>

                    <View style={styles.yellowCard}>
                        <View style={styles.smallIconBoxYellow}>
                            <Text style={styles.analyticsIcon}>🔥</Text>
                        </View>
                        <Text style={styles.analyticsTitle}>Categories</Text>
                        <Text style={styles.analyticsAmount}>
                            {activeCategoriesCount > 0 ? `${activeCategoriesCount} / ${categories.length}` : `${categories.length}`}
                        </Text>
                        <Text style={styles.analyticsSubtitle}>
                            {activeCategoriesCount > 0 ? `${activeCategoriesCount} with items` : '10 available'}
                        </Text>
                    </View>
                </View>

                {/* Categories Header */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Category Breakdown</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>{categories.length} Categories</Text>
                    </View>
                </View>

                {/* Category List Items - Showing all 10 categories clearly with icons, amounts & counts */}
                {categories.map((item) => {
                    const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.categoryCard}
                            activeOpacity={0.8}
                            onPress={() => {
                                setSelectedCategory(item);
                                setCategoryModalVisible(true);
                            }}
                        >
                            <View style={styles.categoryHeaderRow}>
                                {/* Left side: Emoji badge & Category title & Items count */}
                                <View style={styles.categoryLeftGroup}>
                                    <View style={[styles.categoryIconBadge, { backgroundColor: item.lightBg }]}>
                                        <Text style={styles.categoryEmoji}>{item.icon}</Text>
                                    </View>
                                    <View style={styles.categoryTitleGroup}>
                                        <Text style={styles.categoryNameText}>{item.name}</Text>
                                        <Text style={styles.categoryItemSubtext}>
                                            {item.itemCount > 0
                                                ? `${item.itemCount} ${item.itemCount === 1 ? 'item' : 'items'} in cart`
                                                : 'No items added'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Right side: Amount & percentage pill */}
                                <View style={styles.categoryRightGroup}>
                                    <Text style={[
                                        styles.categoryPriceText,
                                        item.amount > 0 ? styles.categoryPriceActive : styles.categoryPriceMuted,
                                    ]}>
                                        {currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                    </Text>
                                    <View style={[
                                        styles.categoryPercentPill,
                                        item.amount > 0 ? { backgroundColor: item.lightBg } : { backgroundColor: '#F3F4F6' },
                                    ]}>
                                        <Text style={[
                                            styles.categoryPercentText,
                                            item.amount > 0 ? { color: item.color } : { color: '#9CA3AF' },
                                        ]}>
                                            {percentage.toFixed(0)}%
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Category Progress Horizontal Bar */}
                            <View style={styles.categoryProgressTrack}>
                                <View
                                    style={[
                                        styles.categoryProgressFill,
                                        {
                                            width: `${Math.min(percentage, 100)}%`,
                                            backgroundColor: item.amount > 0 ? item.color : '#E5E7EB',
                                        },
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* Weekly Spending Graph Header */}
                <Text style={styles.sectionTitle}>Weekly Spending</Text>

                {/* Visual Bar Chart Box */}
                <View style={styles.chartBox}>
                    <View style={styles.graphContainer}>
                        {weeklyData.map((d, idx) => (
                            <View key={idx} style={styles.barColumn}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: d.barHeight,
                                            backgroundColor: d.isToday ? "#FF6B00" : (d.amount > 0 ? "#FFA366" : "#E5E7EB"),
                                        },
                                    ]}
                                />
                            </View>
                        ))}
                    </View>

                    <View style={styles.daysRow}>
                        {weeklyData.map((d, idx) => (
                            <Text
                                key={idx}
                                style={d.isToday ? styles.activeDay : styles.day}
                            >
                                {d.day}
                            </Text>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* ─── FLOATING ACTION BUTTON ─── */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setExpenseModalVisible(true)}
            >
                <Text style={styles.plus}>+</Text>
            </TouchableOpacity>

            {/* ─── MODALS ─── */}
            <AddExpenseModal
                visible={expenseModalVisible}
                onClose={() => setExpenseModalVisible(false)}
                onAdd={handleAddCategory}
            />

            <EditBudgetModal
                visible={budgetModalVisible}
                onClose={() => setBudgetModalVisible(false)}
                currentBudget={budget}
                onSave={(newBudget: number) => {
                    setMonthlyBudget(newBudget);
                }}
                currency={currency}
            />

            <EditCategoryModal
                visible={categoryModalVisible}
                onClose={() => setCategoryModalVisible(false)}
                categoryName={selectedCategory?.name || ""}
                currentAmount={selectedCategory?.amount || 0}
                onSave={handleSaveCategoryAmount}
                onDelete={handleDeleteCategory}
            />

            {/* ─── FIXED BOTTOM TAB BAR ─── */}
            <View style={styles.footerTabBar}>
                {/* Home Button */}
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => router.push('/home')}
                >
                    <LayoutGrid size={24} color="#9CA3AF" />
                    <Text style={styles.tabLabel}>Home</Text>
                </TouchableOpacity>

                {/* Scan Button */}
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => router.push('/Scan')}
                >
                    <Scan size={24} color="#9CA3AF" />
                    <Text style={styles.tabLabel}>Scan</Text>
                </TouchableOpacity>

                {/* Add Button */}
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => router.push('/AddScreen')}
                >
                    <PlusCircle size={24} color="#9CA3AF" />
                    <Text style={styles.tabLabel}>Add</Text>
                </TouchableOpacity>

                {/* Cart Button */}
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => router.push('/Scan?tab=cart')}
                    activeOpacity={0.7}
                >
                    <ShoppingBag size={24} color="#9CA3AF" />
                    <Text style={styles.tabLabel}>Cart</Text>
                </TouchableOpacity>

                {/* Budget Button */}
                <TouchableOpacity style={styles.tabButton} activeOpacity={1}>
                    <View style={styles.activeTabIconContainer}>
                        <PieChart size={24} color="#E65F2B" />
                    </View>
                    <Text style={[styles.tabLabel, styles.activeTabLabel]}>
                        Budget
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fixedTopContainer: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 5,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
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
    emptySpace: {
        width: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: '#111827',
    },
    budgetCard: {
        borderRadius: 24,
        padding: 18,
        marginBottom: 5,
        position: "relative",
    },
    walletCircle: {
        position: "absolute",
        right: 15,
        top: 15,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    walletIcon: {
        fontSize: 24,
    },
    budgetLabel: {
        color: "white",
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    budgetAmount: {
        color: "white",
        fontSize: 34,
        fontWeight: "bold",
        marginTop: 6,
        marginBottom: 16,
    },
    progressBackground: {
        height: 8,
        backgroundColor: "#FFA366",
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: 8,
        backgroundColor: "white",
        borderRadius: 10,
    },
    budgetRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    smallText: {
        color: "white",
        fontSize: 13,
        fontWeight: "500",
    },
    analyticsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 22,
    },
    greenCard: {
        width: "48%",
        backgroundColor: "#E8F7EE",
        borderRadius: 22,
        padding: 18,
    },
    yellowCard: {
        width: "48%",
        backgroundColor: "#FFF7E6",
        borderRadius: 22,
        padding: 18,
    },
    smallIconBoxGreen: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#D3F2DF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    smallIconBoxYellow: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#FFF0C7",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    analyticsIcon: {
        fontSize: 22,
    },
    analyticsTitle: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "600",
    },
    analyticsAmount: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        marginTop: 6,
    },
    analyticsSubtitle: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 4,
        fontWeight: "500",
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    countBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    // Category Breakdown Card Styles
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    categoryHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryLeftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIconBadge: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryEmoji: {
        fontSize: 22,
    },
    categoryTitleGroup: {
        flex: 1,
    },
    categoryNameText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    categoryItemSubtext: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    categoryRightGroup: {
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    categoryPriceText: {
        fontSize: 15,
        fontWeight: '800',
    },
    categoryPriceActive: {
        color: '#111827',
    },
    categoryPriceMuted: {
        color: '#9CA3AF',
    },
    categoryPercentPill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
    },
    categoryPercentText: {
        fontSize: 11,
        fontWeight: '700',
    },
    categoryProgressTrack: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        marginTop: 10,
        overflow: 'hidden',
    },
    categoryProgressFill: {
        height: 6,
        borderRadius: 3,
    },
    // Chart
    chartBox: {
        height: 230,
        backgroundColor: "#F9FAFB",
        borderRadius: 24,
        padding: 20,
        marginTop: 14,
        marginBottom: 100,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    graphContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flex: 1,
        marginBottom: 14,
        paddingHorizontal: 6,
    },
    barColumn: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 20,
        borderRadius: 10,
    },
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    day: {
        color: "#9CA3AF",
        fontSize: 12,
        fontWeight: '500',
    },
    activeDay: {
        color: "#FF6B00",
        fontWeight: "700",
        fontSize: 12,
    },
    floatingButton: {
        position: "absolute",
        bottom: 84,
        right: 22,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#FF6B00",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#FF6B00',
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    plus: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        marginTop: -2,
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
});