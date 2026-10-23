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
    Scale
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

export default function TermsOfService() {
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
                        Terms of Service
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
                            <View style={styles.legalIconContainer}>
                                <Scale size={40} color="#E65F2B" />
                            </View>
                        </View>

                        <Text style={styles.userName}>
                            Legal Agreement
                        </Text>

                        <Text style={styles.userEmail}>
                            Last Updated: May 2026
                        </Text>

                        <Text style={styles.membershipText}>
                            Please read these terms carefully before using Smart Shopping services.
                        </Text>
                    </View>

                    {/* ================= TERMS DOCUMENT SECTIONS ================= */}

                    {/* SECTION 1 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>1. Acceptance of Terms</Text>
                            <Text style={styles.descriptionText}>
                                By downloading, installing, or accessing the Smart Shopping platform, you agree
                                to be legally bound by these terms. If you do not accept these guidelines,
                                you may not use any associated tool features or metric scanners.
                            </Text>
                        </View>
                    </View>

                    {/* SECTION 2 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>2. App Use & Price Scanning</Text>
                            <Text style={styles.descriptionText}>
                                Our software provides real-time discount comparison matrices. You agree to utilize
                                barcode scans and price checking metrics strictly for legitimate personal evaluation.
                                Automated scraping or exploitation of application databases is prohibited.
                            </Text>
                        </View>
                    </View>

                    {/* SECTION 3 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>3. User Accounts</Text>
                            <Text style={styles.descriptionText}>
                                When setting up your digital identity profile, you must provide valid operational information.
                                You remain solely liable for all active tasks, historical data, and discount streaks linked
                                directly to your local account context.
                            </Text>
                        </View>
                    </View>

                    {/* SECTION 4 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>4. Limitation of Liability</Text>
                            <Text style={styles.descriptionText}>
                                Retail product updates fluctuate unexpectedly. Smart Shopping acts as an auxiliary comparison tool
                                and does not guarantee store-level point-of-sale policy matches or final checkout numbers.
                            </Text>
                        </View>
                    </View>

                    {/* ================= FOOTER ================= */}
                    <Text style={styles.footerVersion}>
                        Thank you for choosing Smart Shopping.
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
        padding: 25,
        alignItems: 'center',
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    avatarContainer: {
        marginBottom: 16,
    },

    legalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
    },

    userEmail: {
        fontSize: 14,
        color: '#E65F2B',
        fontWeight: '600',
        marginTop: 4,
    },

    membershipText: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 18,
    },

    // ================= TEXT BLOCKS SYSTEM =================
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

    descriptionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },

    descriptionText: {
        fontSize: 13,
        lineHeight: 20,
        color: '#4B5563',
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