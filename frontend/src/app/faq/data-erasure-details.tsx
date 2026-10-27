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
    ShieldAlert
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

export default function DataErasureFAQ() {
    const router = useRouter();

    const erasureSteps = [
        {
            step: "Method 1",
            title: "In-App Profile Deletion",
            description: "Navigate straight to your profile account settings view sheet, scroll downward to the baseline management interface, and choose the 'Delete Core Account Data' button command parameters."
        },
        {
            step: "Method 2",
            title: "Email Request Channel",
            description: "Send an official data request note straight to privacy@smartshopping.com with the subject line 'Data Erasure Request (GDPR / CCPA)'. Our safety team will completely purge all synced server metric nodes."
        },
        {
            step: "Timeline",
            title: "Processing Window Period",
            description: "Once requested, your operational metrics history logs, cached barcode tracking indexes, and personal ledger information elements will be wiped out within 3 business days."
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
                            Data Privacy
                        </Text>

                        <Text style={styles.membershipText}>
                            How to request data erasure details? Review the direct data removal compliance protocols step-by-step.
                        </Text>
                    </View>

                    {/* ================= INSTRUCTION STEPS LIST ================= */}
                    <Text style={styles.sectionLabel}>Erasure Request Workflow</Text>

                    {erasureSteps.map((item, index) => (
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

                    {/* ================= PERMANENT ACTIONS WARNING NOTE ================= */}
                    <View style={[styles.listSection, styles.noteContainer]}>
                        <View style={styles.descriptionPadding}>
                            <View style={styles.noteHeader}>
                                <ShieldAlert size={16} color="#E65F2B" />
                                <Text style={styles.noteTitle}>Irreversible Operation</Text>
                            </View>
                            <Text style={styles.noteText}>
                                Please bear in mind that data purges are strictly final. Erasing your database entries cannot be undone, and you will lose all saved metric historical metrics logs permanently.
                            </Text>
                        </View>
                    </View>

                    {/* ================= FOOTER ================= */}
                    <Text style={styles.footerVersion}>
                        Need legal assistance? Check our complete Privacy Policy screen.
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