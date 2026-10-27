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
    ShieldCheck
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

export default function PrivacyPolicy() {
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
                        Privacy Policy
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
                            <View style={styles.privacyIconContainer}>
                                <ShieldCheck size={40} color="#E65F2B" />
                            </View>
                        </View>

                        <Text style={styles.userName}>
                            Data & Privacy
                        </Text>

                        <Text style={styles.userEmail}>
                            Last Updated: May 2026
                        </Text>

                        <Text style={styles.membershipText}>
                            We value your trust. Learn how we handle and protect your shopping data.
                        </Text>
                    </View>

                    {/* ================= POLICY SECTIONS ================= */}

                    {/* SECTION 1 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>1. Information We Collect</Text>
                            <Text style={styles.descriptionText}>
                                We only collect information essential for tracking your savings, such as your
                                email address, device type, local barcode scan history, and metric selections.
                                We do not access or store your raw camera images.
                            </Text>
                        </View>
                    </View>

                    {/* SECTION 2 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>2. How We Use Data</Text>
                            <Text style={styles.descriptionText}>
                                Your scan history data is used solely to generate internal price analytics,
                                maintain your active streaks, and display localized discount notifications.
                                We never sell your personal metrics to third-party data brokers.
                            </Text>
                        </View>
                    </View>

                    {/* SECTION 3 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>3. Security Practices</Text>
                            <Text style={styles.descriptionText}>
                                All user sync interactions are encrypted end-to-end using industry-standard protocols.
                                Your local profile preferences are secured dynamically within your device's isolated storage
                                system to prevent unauthorized access.
                            </Text>
                        </View>
                    </View>

                    {/* SECTION 4 */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>4. Your Rights & Erasure</Text>
                            <Text style={styles.descriptionText}>
                                You retain complete sovereignty over your profile. At any time, you can clear your locally saved
                                scans or submit a direct formal request through our Help & Support tab to instantly wipe all
                                server-backed analytics data records.
                            </Text>
                        </View>
                    </View>

                    {/* ================= FOOTER ================= */}
                    <Text style={styles.footerVersion}>
                        Your privacy is fully protected under our system rules.
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

    privacyIconContainer: {
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