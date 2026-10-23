import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import AddExpenseModal from "../components/AddExpenseModal";
import EditBudgetModal from "../components/EditBudgetModal";
import EditCategoryModal from "../components/EditCategoryModal";

// ✅ Included all used icons including ArrowLeft
import { LayoutGrid, Scan, PlusCircle, ShoppingBag, PieChart, ArrowLeft } from "lucide-react-native";

type Category = {
    name: string;
    amount: number;
    color: string;
};

export default function BudgetScreen() {
    const router = useRouter();

    // Budget State
    const [budget, setBudget] = useState(2500);

    // Currency State
    const [currency, setCurrency] = useState("₹");

    // Modals Visibility State
    const [expenseModalVisible, setExpenseModalVisible] = useState(false);
    const [budgetModalVisible, setBudgetModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    // Selected Category State
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Categories State
    const [categories, setCategories] = useState<Category[]>([
        { name: "Groceries", amount: 349, color: "#FF6B00" },
        { name: "Dairy", amount: 312, color: "#7ED321" },
        { name: "Bakery", amount: 45, color: "#E6B800" },
        { name: "Household", amount: 285, color: "#00B8D9" },
        { name: "Produce", amount: 280, color: "#FF3B6B" },
    ]);

    // Financial Calculations
    const totalExpenses = categories.reduce(
        (total, item) => total + item.amount,
        0,
    );

    const remainingBudget = budget - totalExpenses;
    const progress = budget > 0 ? (totalExpenses / budget) * 100 : 0;

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
                            {currency} {budget}
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
                                {currency} {totalExpenses} spent
                            </Text>
                            <Text style={styles.smallText}>
                                {currency} {remainingBudget} left
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
                            {currency} {remainingBudget}
                        </Text>
                    </View>

                    <View style={styles.yellowCard}>
                        <View style={styles.smallIconBoxYellow}>
                            <Text style={styles.analyticsIcon}>🔥</Text>
                        </View>
                        <Text style={styles.analyticsTitle}>Categories</Text>
                        <Text style={styles.analyticsAmount}>{categories.length}</Text>
                    </View>
                </View>

                {/* Categories Header */}
                <Text style={styles.sectionTitle}>Category Breakdown</Text>

                {/* Category List Items */}
                {categories.map((item, index) => {
                    const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.categoryItem}
                            activeOpacity={0.8}
                            onPress={() => {
                                setSelectedCategory(item);
                                setCategoryModalVisible(true);
                            }}
                        >
                            <View style={styles.categoryTop}>
                                <View style={styles.categoryLeft}>
                                    <View
                                        style={[styles.sideBar, { backgroundColor: item.color }]}
                                    />
                                    <Text style={styles.categoryName}>{item.name}</Text>
                                </View>

                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.categoryPrice}>
                                        {currency} {item.amount}
                                    </Text>
                                    <Text style={styles.categoryPercent}>
                                        {percentage.toFixed(0)}%
                                    </Text>
                                </View>
                            </View>

                            {/* Category Progress Horizontal Bar */}
                            <View style={styles.categoryBarBg}>
                                <View
                                    style={[
                                        styles.categoryBarFill,
                                        {
                                            width: `${percentage}%`,
                                            backgroundColor: item.color,
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
                        <View style={[styles.bar, { height: 60 }]} />
                        <View style={[styles.bar, { height: 100 }]} />
                        <View style={[styles.bar, { height: 80 }]} />
                        <View style={[styles.bar, { height: 140 }]} />
                        <View style={[styles.bar, { height: 120 }]} />
                        <View style={[styles.bar, { height: 160 }]} />
                        <View style={[styles.bar, { height: 130 }]} />
                    </View>

                    <View style={styles.daysRow}>
                        <Text style={styles.day}>Mon</Text>
                        <Text style={styles.day}>Tue</Text>
                        <Text style={styles.day}>Wed</Text>
                        <Text style={styles.day}>Thu</Text>
                        <Text style={styles.day}>Fri</Text>
                        <Text style={styles.day}>Sat</Text>
                        <Text style={styles.activeDay}>Sun</Text>
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
                onAdd={(newCategory: Category) => {
                    setCategories([...categories, newCategory]);
                }}
            />

            <EditBudgetModal
                visible={budgetModalVisible}
                onClose={() => setBudgetModalVisible(false)}
                currentBudget={budget}
                onSave={(newBudget: number) => setBudget(newBudget)}
                currency={currency}
                setCurrency={setCurrency}
            />

            <EditCategoryModal
                visible={categoryModalVisible}
                onClose={() => setCategoryModalVisible(false)}
                categoryName={selectedCategory?.name || ""}
                currentAmount={selectedCategory?.amount || 0}
                onSave={(newAmount: number) => {
                    const updatedCategories = categories.map((cat) => {
                        if (cat.name === selectedCategory?.name) {
                            return { ...cat, amount: newAmount };
                        }
                        return cat;
                    });
                    setCategories(updatedCategories);
                }}
                onDelete={() => {
                    const filtered = categories.filter(
                        (cat) => cat.name !== selectedCategory?.name,
                    );
                    setCategories(filtered);
                }}
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
                <TouchableOpacity style={styles.tabButton}>
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
    },
    analyticsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    greenCard: {
        width: "48%",
        backgroundColor: "#E8F7EE",
        borderRadius: 25,
        padding: 20,
    },
    yellowCard: {
        width: "48%",
        backgroundColor: "#FFF7E6",
        borderRadius: 25,
        padding: 20,
    },
    smallIconBoxGreen: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#D3F2DF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    smallIconBoxYellow: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FFF0C7",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    analyticsIcon: {
        fontSize: 24,
    },
    analyticsTitle: {
        fontSize: 16,
        color: "#666",
    },
    analyticsAmount: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 18,
    },
    categoryItem: {
        marginBottom: 20,
    },
    categoryTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    categoryLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    sideBar: {
        width: 10,
        height: 40,
        borderRadius: 10,
        marginRight: 12,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
    },
    categoryPrice: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    categoryPercent: {
        color: "gray",
        fontSize: 16,
        marginTop: 3,
    },
    categoryBarBg: {
        height: 10,
        backgroundColor: "#EEEEEE",
        borderRadius: 10,
        marginLeft: 22,
    },
    categoryBarFill: {
        height: 10,
        borderRadius: 10,
    },

    // 👇 UPDATED: Decreased bottom margin so it pulls close to the footer tab bar
    chartBox: {
        height: 260,
        backgroundColor: "#F7F7F7",
        borderRadius: 30,
        padding: 20,
        marginBottom: 100, // Lowered from 140 to pull it down
    },

    graphContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flex: 1,
        marginBottom: 20,
    },
    bar: {
        width: 22,
        backgroundColor: "#FF6B00",
        borderRadius: 20,
    },
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    day: {
        color: "gray",
    },
    activeDay: {
        color: "#FF6B00",
        fontWeight: "bold",
    },
    floatingButton: {
        position: "absolute",
        bottom: 80,
        right: 25,
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#FF6B00",
        justifyContent: "center",
        alignItems: "center",
    },
    plus: {
        color: "white",
        fontSize: 38,
        fontWeight: "bold",
        marginTop: -3,
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