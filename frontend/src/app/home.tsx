import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  Scan,
  Mic,
  ShoppingCart,
  Percent,
  ShoppingBag,
  Tag,
  LayoutGrid,
  PlusCircle,
  PieChart,
} from 'lucide-react-native';

// ✅ Fixed import package for proper cross-platform layout behavior
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

// ✅ IMPORT ROUTER
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

// ✅ Helper to get real-time dynamic greeting
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export default function Index() {

  // ✅ ROUTER
  const router = useRouter();
  const { currency, cartItems, totalCartSpend, user, monthlyBudget } = useUser();
  const sym = currency?.symbol || '$';

  // Dynamic real-time greeting
  const [greeting, setGreeting] = useState<string>(getGreeting());

  useEffect(() => {
    setGreeting(getGreeting());
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Check every minute for time-of-day changes

    return () => clearInterval(timer);
  }, []);

  // Dynamic values
  const totalSpent = cartItems && cartItems.length > 0 ? totalCartSpend : 0;
  const budgetLimit = (monthlyBudget && monthlyBudget > 0) ? monthlyBudget : 0;

  // Dynamic savings from active cart discounts
  const totalCartSavings = (cartItems || []).reduce((acc, item) => {
    if (item.discount && item.discount > 0) {
      const origPrice = item.price / (1 - item.discount / 100);
      return acc + (origPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  const displaySavings = totalCartSavings > 0 ? Math.round(totalCartSavings).toLocaleString() : '0';

  // Percentage Calculation
  const percentage = budgetLimit > 0
    ? Math.min(Math.round((totalSpent / budgetLimit) * 100), 100)
    : 0;

  // SVG Config
  const size = 100;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom']}
      >

        {/* ================= HEADER ================= */}
        <View style={styles.topHeader}>

          <View>
            <Text style={styles.greetingText}>
              {greeting}
            </Text>

            <Text style={styles.userName}>
              {user?.fullName || 'Smart Shopper'}
            </Text>
          </View>

          {/* ✅ CLICKABLE PROFILE IMAGE */}
          <TouchableOpacity
            onPress={() => router.push('/profile')}
          >
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>

        </View>

        {/* ================= CONTENT ================= */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ================= BUDGET CARD ================= */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/budget')}
          >
            <LinearGradient
              colors={["#FF8A00", "#FF5E00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.budgetCard}
            >

            <View style={styles.budgetTextSection}>

              <Text style={styles.budgetLabel}>
                Total Spent
              </Text>

              <Text style={styles.totalSpentAmount}>
                {sym}{totalSpent.toLocaleString()}
              </Text>

              <Text style={styles.budgetLimit}>
                of {sym}{budgetLimit.toLocaleString()} budget
              </Text>

              <View style={styles.badgeRow}>

                <View style={styles.budgetBadge}>
                  <ShoppingBag
                    size={14}
                    color="#E65F2B"
                  />

                  <Text style={styles.badgeText}>
                    {cartItems && cartItems.length > 0
                      ? `${cartItems.reduce((s, i) => s + i.quantity, 0)} Items`
                      : '0 Items'}
                  </Text>
                </View>

                <View style={styles.budgetBadge}>
                  <Tag
                    size={14}
                    color="#E65F2B"
                  />

                  <Text style={styles.badgeText}>
                    {cartItems && cartItems.filter(i => (i.discount || 0) > 0).length > 0
                      ? `${cartItems.filter(i => (i.discount || 0) > 0).length} Discounts`
                      : '0 Discounts'}
                  </Text>
                </View>

              </View>

            </View>

            {/* ================= PROGRESS RING ================= */}
            <View style={styles.progressContainer}>

              <Svg width={size} height={size}>

                {/* Base Circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* Progress Circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#FFFFFF"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />

              </Svg>

              <View style={styles.innerCircle}>
                <Text style={styles.progressPercentage}>
                  {percentage}%
                </Text>

                <Text style={styles.progressLabel}>
                  USED
                </Text>
              </View>

            </View>

            </LinearGradient>
          </TouchableOpacity>

          {/* ================= QUICK ACTIONS ================= */}
          <View style={styles.headerCard}>

            <View style={styles.actionRow}>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/Scan')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: '#FFF5F0' },
                  ]}
                >
                  <Scan size={24} color="#E65F2B" />
                </View>

                <Text style={styles.actionText}>
                  Scan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push({ pathname: '/AddScreen', params: { autoVoice: 'true' } })}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: '#F0FDF4' },
                  ]}
                >
                  <Mic size={24} color="#15803D" />
                </View>

                <Text style={styles.actionText}>
                  Voice
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/Scan?tab=cart')}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: '#FFFBEB' },
                  ]}
                >
                  <ShoppingCart size={24} color="#B45309" />
                </View>

                <Text style={styles.actionText}>
                  Cart
                </Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* ================= RECENT ITEMS ================= */}
          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Recent Items
            </Text>

            <TouchableOpacity onPress={() => router.push('/Scan?tab=cart')}>
              <Text style={styles.viewAllText}>
                View All
              </Text>
            </TouchableOpacity>

          </View>

          {cartItems && cartItems.length > 0 ? (
            cartItems.slice(0, 5).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => router.push('/Scan?tab=cart')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.itemIconBadge,
                    { backgroundColor: item.category === 'dairy' ? '#F0FDF4' : '#FFF5F0' },
                  ]}
                >
                  {item.category === 'dairy' ? (
                    <Mic size={18} color="#15803D" />
                  ) : (
                    <Scan size={18} color="#E65F2B" />
                  )}
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {(item.category || 'General').charAt(0).toUpperCase() + (item.category || 'General').slice(1)} · Qty: {item.quantity}
                  </Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    {sym}{(item.price * item.quantity).toFixed(2)}
                  </Text>
                  {item.discount && item.discount > 0 ? (
                    <Text style={[styles.discountText, { color: '#E11D48' }]}>
                      -{item.discount}%
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyItemsCard}>
              <View style={styles.emptyIconCircle}>
                <ShoppingBag size={24} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No items scanned yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap Scan or Voice below to start adding your shopping items!
              </Text>
            </View>
          )}

          {/* ================= SAVINGS BANNER ================= */}
          <View style={styles.savingsBanner}>

            <View style={styles.savingsIconContainer}>
              <Percent size={14} color="#15803D" />
            </View>

            <View style={styles.savingsTextContainer}>
              <Text style={styles.savingsTitle}>
                {`You saved ${sym}${displaySavings} today!`}
              </Text>

              <Text style={styles.savingsSubtitle}>
                From discounts and smart comparisons
              </Text>
            </View>

          </View>

        </ScrollView>

        {/* ================= BOTTOM TAB BAR ================= */}
        <View style={styles.footerTabBar}>

          <TouchableOpacity style={styles.tabButton}>
            <View style={styles.activeTabIconContainer}>
              <LayoutGrid size={24} color="#E65F2B" />
            </View>

            <Text
              style={[
                styles.tabLabel,
                styles.activeTabLabel,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => router.push('/Scan?tab=cart')}
            activeOpacity={0.7}
          >
            <ShoppingBag size={24} color="#9CA3AF" />
            <Text style={styles.tabLabel}>Cart</Text>
          </TouchableOpacity>

          {/* ✅ UPDATED BUDGET ROUTE CLICK TRIGGER */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => router.push('/budget')}
            activeOpacity={0.7}
          >
            <PieChart size={24} color="#9CA3AF" />
            <Text style={styles.tabLabel}>Budget</Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </SafeAreaProvider >
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : 0,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  budgetCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetTextSection: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFDDD0',
  },
  totalSpentAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  budgetLimit: {
    fontSize: 13,
    color: '#FFDDD0',
    fontWeight: '500',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    position: 'relative',
    width: 100,
    height: 100,
  },
  innerCircle: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 1,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    width: 70,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65F2B',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  savingsBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  savingsIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  savingsTextContainer: {
    flex: 1,
  },
  savingsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
  },
  savingsSubtitle: {
    fontSize: 12,
    color: '#166534',
    marginTop: 1,
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
  emptyItemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});