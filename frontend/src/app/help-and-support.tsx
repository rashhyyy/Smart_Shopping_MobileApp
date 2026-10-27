import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';

import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';

import {
    ArrowLeft,
    HelpCircle,
    ChevronRight,
    Mail,
    MessageSquare,
    Search,
    BookOpen,
    Heart
} from 'lucide-react-native';

import { useRouter, Link } from 'expo-router';

export default function HelpAndSupport() {
    const router = useRouter();

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={styles.safeArea}
                edges={['top', 'bottom']}
            >
                {/* ================= HEADER ================= */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.roundButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Help & Support
                    </Text>

                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                {/* ================= CONTENT ================= */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ================= SEARCH BAR ================= */}
                    <View style={styles.searchContainer}>
                        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search topics or questions..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* ================= TOP FAQ CARD ================= */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.supportIconContainer}>
                                <HelpCircle size={40} color="#E65F2B" />
                            </View>
                        </View>

                        <Text style={styles.userName}>
                            How can we help you?
                        </Text>

                        <Text style={styles.membershipText}>
                            Check our popular knowledge base or contact support channels below.
                        </Text>
                    </View>

                    {/* ================= CONTACT CHANNELS ================= */}
                    <Text style={styles.sectionLabel}>Contact Channels</Text>
                    <View style={styles.listSection}>

                        {/* EMAIL SUPPORT LINK */}
                        <Link href="/email-support" asChild>
                            <TouchableOpacity style={styles.listItem}>
                                <View style={styles.singleLineLeft}>
                                    <Mail size={18} color="#4B5563" />
                                    <Text style={styles.listItemText} numberOfLines={1}>Email Support</Text>
                                </View>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </Link>

                        {/* LIVE CHAT */}
                        <TouchableOpacity style={[styles.listItem, styles.lastItem]}>
                            <View style={styles.singleLineLeft}>
                                <MessageSquare size={18} color="#4B5563" />
                                <Text style={styles.listItemText} numberOfLines={1}>Live Chat Assistance</Text>
                            </View>
                            <ChevronRight size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* ================= FAQ ACCORDION SECTION ================= */}
                    <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
                    <View style={styles.listSection}>

                        {/* HOW DO I UPDATE SCAN PRICE METRICS? */}
                        <Link href="/faq/update-metrics" asChild>
                            <TouchableOpacity style={styles.listItem}>
                                <View style={styles.singleLineLeft}>
                                    <BookOpen size={18} color="#E65F2B" />
                                    <Text style={styles.faqItemText} numberOfLines={1}>How do I update scan price metrics?</Text>
                                </View>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </Link>

                        {/* WHY ISN'T MY CURRENCY CHANGING? */}
                        <Link href="/faq/why-currency-not-changing" asChild>
                            <TouchableOpacity style={styles.listItem}>
                                <View style={styles.singleLineLeft}>
                                    <BookOpen size={18} color="#E65F2B" />
                                    <Text style={styles.faqItemText} numberOfLines={1}>Why isn't my currency changing?</Text>
                                </View>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </Link>

                        {/* CAN I SHARE SAVED DISCOUNT CODES? */}
                        <Link href="/faq/share-discount-codes" asChild>
                            <TouchableOpacity style={styles.listItem}>
                                <View style={styles.singleLineLeft}>
                                    <BookOpen size={18} color="#E65F2B" />
                                    <Text style={styles.faqItemText} numberOfLines={1}>Can I share saved discount codes?</Text>
                                </View>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </Link>

                        {/* HOW TO REQUEST DATA ERASURE DETAILS? */}
                        <Link href="/faq/data-erasure-details" asChild>
                            <TouchableOpacity style={styles.listItem}>
                                <View style={styles.singleLineLeft}>
                                    <BookOpen size={18} color="#E65F2B" />
                                    <Text style={styles.faqItemText} numberOfLines={1}>How to request data erasure details?</Text>
                                </View>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </Link>
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

    // ================= HEADER =================
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
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },

    // ================= CONTENT =================
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },

    // ================= SEARCH BAR =================
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 48,
        marginVertical: 8,
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
    },

    // ================= HERO SUPPORT CARD =================
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    avatarContainer: {
        marginBottom: 14,
    },

    supportIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },

    membershipText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 6,
        textAlign: 'center',
        lineHeight: 18,
    },

    // ================= SECTION LABEL =================
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 4,
        marginTop: 16,
        marginBottom: 10,
    },

    // ================= LIST STYLES =================
    listSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 8,
    },

    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    // Core single line container enforcing perfect side-by-side distribution
    singleLineLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 8,
    },

    listItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },

    faqItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        flex: 1,
    },
});