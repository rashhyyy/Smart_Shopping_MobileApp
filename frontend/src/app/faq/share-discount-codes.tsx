import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';

import {
    ArrowLeft,
    BookOpen,
    Share2
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

export default function ShareDiscountFAQ() {
    const router = useRouter();

    const sharingFeatures = [
        {
            step: "Option 1",
            title: "Direct Code Sharing",
            description: "Yes! You can instantly share any saved discount coupon or promotional code with friends and family by clicking the native share shortcut icon directly attached to your saved cards stack."
        },
        {
            step: "Option 2",
            title: "Clipboard Copying",
            description: "Tap single-click on any highlighted text string code parameters to instantly pull it to your global device clipboard memory for immediate pasting elsewhere."
        },
        {
            step: "Option 3",
            title: "Shared Household Lists",
            description: "Premium members can assign items into dynamically linked shared folders, meaning anyone you sync onto your profile metrics can view the associated coupons transparently."
        }
    ];

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
                        FAQ Guide
                    </Text>

                    {/* Spacer layout to maintain perfect alignment symmetry */}
                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                {/* ================= CONTENT ================= */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ================= HERO CARD ================= */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.faqIconContainer}>
                                <BookOpen size={40} color="#E65F2B" />
                            </View>
                        </View>

                        <Text style={styles.userName}>
                            Sharing Coupons
                        </Text>

                        <Text style={styles.membershipText}>
                            Can I share saved discount codes? Discover the built-in system tools for distributing smart retail voucher entries.
                        </Text>
                    </View>

                    {/* ================= INSTRUCTION STEPS LIST ================= */}
                    <Text style={styles.sectionLabel}>Sharing Capability Features</Text>

                    {sharingFeatures.map((item, index) => (
                        <View key={index} style={styles.listSection}>
                            <View style={styles.descriptionPadding}>
                                <View style={styles.stepTitleRow}>
                                    <Text style={styles.stepBadge}>{item.step}</Text>
                                    <Text style={styles.descriptionTitle}>{item.title}</Text>
                                </View>
                                <Text style={styles.descriptionText}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {/* ================= SHARING RESTRICTION NOTE ================= */}
                    <View style={[styles.listSection, styles.noteContainer]}>
                        <View style={styles.descriptionPadding}>
                            <View style={styles.noteHeader}>
                                <Share2 size={16} color="#E65F2B" />
                                <Text style={styles.noteTitle}>Important Policy Check</Text>
                            </View>
                            <Text style={styles.noteText}>
                                Some single-use unique alphanumeric coupons generated through strategic rewards are strictly bounded directly to individual hardware sync signatures.
                            </Text>
                        </View>
                    </View>

                    {/* ================= FOOTER ================= */}
                    <Text style={styles.footerVersion}>
                        Still need a hand? Connect through our Help channels.
                    </Text>
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

    // ================= HERO DOCUMENT CARD =================
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

    faqIconContainer: {
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

    // ================= LABEL SECTION =================
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 4,
        marginTop: 12,
        marginBottom: 12,
    },

    // ================= REUSABLE STEPS SYSTEM =================
    listSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    descriptionPadding: {
        padding: 16,
    },

    stepTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6,
    },

    stepBadge: {
        fontSize: 11,
        fontWeight: '700',
        color: '#E65F2B',
        backgroundColor: '#FFF5F0',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        overflow: 'hidden',
    },

    descriptionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },

    descriptionText: {
        fontSize: 13,
        lineHeight: 20,
        color: '#4B5563',
    },

    // ================= ADDITIONAL NOTE COMPONENT =================
    noteContainer: {
        backgroundColor: '#FFF5F0',
        borderColor: '#FFE0D1',
        marginTop: 6,
    },

    noteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },

    noteTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#E65F2B',
    },

    noteText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#7C2D12',
        fontWeight: '500',
    },

    // ================= FOOTER =================
    footerVersion: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 20,
        marginBottom: 10,
    },
});