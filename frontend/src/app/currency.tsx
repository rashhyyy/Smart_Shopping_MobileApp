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
    Check,
    Search,
    X,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUser, CurrencyItem } from '../context/UserContext';

// Comprehensive dataset of world currencies
const WORLD_CURRENCIES: (CurrencyItem & { region: string })[] = [
    // Major / Popular Currencies
    { code: 'USD', symbol: '$', name: 'United States Dollar', flag: '🇺🇸', region: 'Americas' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', region: 'Europe' },
    { code: 'GBP', symbol: '£', name: 'British Pound Sterling', flag: '🇬🇧', region: 'Europe' },
    { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: '🇱🇰', region: 'Asia' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', region: 'Asia' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', region: 'Americas' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', region: 'Asia' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', region: 'Asia' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', region: 'Asia' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', region: 'Europe' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', region: 'Asia' },

    // Middle East & Gulf
    { code: 'AED', symbol: 'د.إ', name: 'United Arab Emirates Dirham', flag: '🇦🇪', region: 'Middle East' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦', region: 'Middle East' },
    { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal', flag: '🇶🇦', region: 'Middle East' },
    { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar', flag: '🇰🇼', region: 'Middle East' },
    { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar', flag: '🇧🇭', region: 'Middle East' },
    { code: 'OMR', symbol: 'OMR', name: 'Omani Rial', flag: '🇴🇲', region: 'Middle East' },
    { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel', flag: '🇮🇱', region: 'Middle East' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷', region: 'Middle East' },
    { code: 'JOD', symbol: 'JD', name: 'Jordanian Dinar', flag: '🇯🇴', region: 'Middle East' },
    { code: 'LBP', symbol: 'L£', name: 'Lebanese Pound', flag: '🇱🇧', region: 'Middle East' },

    // Asia & Pacific
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿', region: 'Asia' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾', region: 'Asia' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭', region: 'Asia' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', region: 'Asia' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰', region: 'Asia' },
    { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', flag: '🇹🇼', region: 'Asia' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩', region: 'Asia' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭', region: 'Asia' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', flag: '🇻🇳', region: 'Asia' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰', region: 'Asia' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩', region: 'Asia' },
    { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee', flag: '🇳🇵', region: 'Asia' },
    { code: 'MVR', symbol: 'Rf', name: 'Maldivian Rufiyaa', flag: '🇲🇻', region: 'Asia' },

    // Europe
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪', region: 'Europe' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴', region: 'Europe' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰', region: 'Europe' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', flag: '🇵🇱', region: 'Europe' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', flag: '🇨🇿', region: 'Europe' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', flag: '🇭🇺', region: 'Europe' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu', flag: '🇷🇴', region: 'Europe' },
    { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', flag: '🇧🇬', region: 'Europe' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', region: 'Europe' },
    { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦', region: 'Europe' },
    { code: 'ISK', symbol: 'kr', name: 'Icelandic Krona', flag: '🇮🇸', region: 'Europe' },

    // Americas
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', region: 'Americas' },
    { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', flag: '🇲🇽', region: 'Americas' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso', flag: '🇦🇷', region: 'Americas' },
    { code: 'CLP', symbol: '$', name: 'Chilean Peso', flag: '🇨🇱', region: 'Americas' },
    { code: 'COP', symbol: '$', name: 'Colombian Peso', flag: '🇨🇴', region: 'Americas' },
    { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', flag: '🇵🇪', region: 'Americas' },
    { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', flag: '🇺🇾', region: 'Americas' },
    { code: 'CRC', symbol: '₡', name: 'Costa Rican Colon', flag: '🇨🇷', region: 'Americas' },
    { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso', flag: '🇩🇴', region: 'Americas' },
    { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar', flag: '🇯🇲', region: 'Americas' },

    // Africa
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', region: 'Africa' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', region: 'Africa' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬', region: 'Africa' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', region: 'Africa' },
    { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', flag: '🇬🇭', region: 'Africa' },
    { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham', flag: '🇲🇦', region: 'Africa' },
    { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', flag: '🇹🇿', region: 'Africa' },
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬', region: 'Africa' },
    { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', flag: '🇪🇹', region: 'Africa' },
    { code: 'MUR', symbol: 'Rs', name: 'Mauritian Rupee', flag: '🇲🇺', region: 'Africa' },
];

const REGION_FILTERS = ['All', 'Popular', 'Asia', 'Europe', 'Americas', 'Middle East', 'Africa'];

export default function CurrencyScreen() {
    const router = useRouter();
    const { currency, setCurrency } = useUser();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Filter currencies by search query and region
    const filteredCurrencies = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return WORLD_CURRENCIES.filter((item) => {
            // Region filter
            if (selectedRegion === 'Popular') {
                const popularCodes = ['USD', 'EUR', 'GBP', 'LKR', 'INR', 'CAD', 'AUD', 'JPY', 'SGD', 'AED'];
                if (!popularCodes.includes(item.code)) return false;
            } else if (selectedRegion !== 'All' && item.region !== selectedRegion) {
                return false;
            }

            // Search filter
            if (!query) return true;
            return (
                item.code.toLowerCase().includes(query) ||
                item.name.toLowerCase().includes(query) ||
                item.symbol.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, selectedRegion]);

    const handleSelectCurrency = (selected: CurrencyItem) => {
        setCurrency(selected);
        setToastMessage(`Currency set to ${selected.code} (${selected.symbol})`);

        setTimeout(() => {
            setToastMessage(null);
        }, 1500);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.roundButton}
                        activeOpacity={0.7}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Select Currency</Text>

                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                {/* Toast Notification */}
                {toastMessage && (
                    <View style={styles.toastContainer}>
                        <View style={styles.toastCard}>
                            <Text style={styles.toastText}>{toastMessage}</Text>
                        </View>
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Active Selected Currency Banner */}
                    <View style={styles.activeCurrencyBanner}>
                        <View style={styles.activeBannerLeft}>
                            <Text style={styles.activeBannerFlag}>{currency?.flag || '🌐'}</Text>
                            <View>
                                <Text style={styles.activeBannerLabel}>ACTIVE CURRENCY</Text>
                                <Text style={styles.activeBannerValue}>
                                    {currency?.code} - {currency?.name} ({currency?.symbol})
                                </Text>
                            </View>
                        </View>
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>Selected</Text>
                        </View>
                    </View>

                    {/* Search Bar Input */}
                    <View style={styles.searchWrapper}>
                        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by code, country, or symbol..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <X size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Region Filter Tags */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.regionFilterRow}
                    >
                        {REGION_FILTERS.map((reg) => {
                            const isRegSelected = selectedRegion === reg;
                            return (
                                <TouchableOpacity
                                    key={reg}
                                    style={[
                                        styles.regionChip,
                                        isRegSelected && styles.regionChipActive,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => setSelectedRegion(reg)}
                                >
                                    <Text
                                        style={[
                                            styles.regionChipText,
                                            isRegSelected && styles.regionChipTextActive,
                                        ]}
                                    >
                                        {reg}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Currency List */}
                    <View style={styles.listHeaderRow}>
                        <Text style={styles.sectionLabel}>
                            {selectedRegion === 'All' ? 'World Currencies' : `${selectedRegion} Currencies`}
                        </Text>
                        <Text style={styles.itemCountText}>
                            {filteredCurrencies.length} available
                        </Text>
                    </View>

                    <View style={styles.listSection}>
                        {filteredCurrencies.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyTitle}>No currencies found</Text>
                                <Text style={styles.emptySubtitle}>
                                    Try searching for a different country name, currency code, or symbol
                                </Text>
                            </View>
                        ) : (
                            filteredCurrencies.map((item, index) => {
                                const isSelected = currency?.code === item.code;
                                const isLastItem = index === filteredCurrencies.length - 1;

                                return (
                                    <TouchableOpacity
                                        key={item.code}
                                        style={[
                                            styles.listItem,
                                            isLastItem && styles.lastItem,
                                            isSelected && styles.selectedListItem,
                                        ]}
                                        activeOpacity={0.7}
                                        onPress={() => handleSelectCurrency(item)}
                                    >
                                        <View style={styles.listItemLeft}>
                                            <View style={styles.flagCircle}>
                                                <Text style={styles.flagText}>{item.flag}</Text>
                                            </View>
                                            <View style={styles.currencyDetails}>
                                                <View style={styles.codeRow}>
                                                    <Text style={styles.currencyCode}>{item.code}</Text>
                                                    <View style={styles.symbolPill}>
                                                        <Text style={styles.symbolPillText}>{item.symbol}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.currencyName} numberOfLines={1}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </View>

                                        {isSelected && (
                                            <View style={styles.checkmarkContainer}>
                                                <Check size={16} color="#FFFFFF" strokeWidth={3} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
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
    toastContainer: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 999,
        alignItems: 'center',
    },
    toastCard: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    activeCurrencyBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF5F0',
        borderWidth: 1,
        borderColor: '#FED7AA',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 6,
        marginBottom: 16,
    },
    activeBannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    activeBannerFlag: {
        fontSize: 26,
        marginRight: 12,
    },
    activeBannerLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#EA580C',
        letterSpacing: 0.5,
    },
    activeBannerValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 2,
    },
    activeBadge: {
        backgroundColor: '#EA580C',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    activeBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
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
    regionFilterRow: {
        paddingBottom: 14,
        gap: 8,
    },
    regionChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    regionChipActive: {
        backgroundColor: '#E65F2B',
        borderColor: '#E65F2B',
    },
    regionChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    regionChipTextActive: {
        color: '#FFFFFF',
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    itemCountText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    listSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    selectedListItem: {
        backgroundColor: '#FFFBF9',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    flagCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    flagText: {
        fontSize: 20,
    },
    currencyDetails: {
        flex: 1,
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    currencyCode: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    symbolPill: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 6,
    },
    symbolPillText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#4B5563',
    },
    currencyName: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    checkmarkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E65F2B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
