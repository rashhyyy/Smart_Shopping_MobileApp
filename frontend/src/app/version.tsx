import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Shield, FileText, CheckCircle2, Cpu } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function VersionDetails() {
    const router = useRouter();

    const appVersion = "2.4.1";
    const buildNumber = "1042";

    // Native sharing utility for diagnostic info
    const handleShareDiagnostics = async () => {
        try {
            await Share.share({
                message: `App Diagnostics — Version: ${appVersion} (${buildNumber}) | OS: ${Platform.OS.toUpperCase()} v${Platform.Version}`,
            });
        } catch (error) {
            console.error("Error sharing diagnostics:", error);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* ================= HEADER ================= */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Version Details</Text>

                    <TouchableOpacity style={styles.roundButton} onPress={handleShareDiagnostics}>
                        <Share2 size={20} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* ================= CONTENT MAIN CONTAINER ================= */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* CORE METRICS SUMMARY CARD */}
                    <View style={styles.versionHeroCard}>
                        <View style={styles.statusBadge}>
                            <CheckCircle2 size={14} color="#E65F2B" />
                            <Text style={styles.statusBadgeText}>Latest Stable Build</Text>
                        </View>
                        <Text style={styles.heroVersionNum}>v{appVersion}</Text>
                        <Text style={styles.heroBuildNum}>Build Reference: #{buildNumber}</Text>
                    </View>

                    {/* SECTION 1: SPECIFICATIONS */}
                    <Text style={styles.sectionLabel}>SPECIFICATIONS</Text>
                    <View style={styles.cardGroup}>
                        <View style={styles.specificationRow}>
                            <View style={styles.rowLeft}>
                                <Cpu size={18} color="#6B7280" />
                                <Text style={styles.rowLabelText}>Environment Platform</Text>
                            </View>
                            <Text style={styles.rowValueText}>
                                {Platform.OS === 'ios' ? 'iOS Production' : 'Android Production'}
                            </Text>
                        </View>
                        <View style={[styles.specificationRow, styles.lastRow]}>
                            <View style={styles.rowLeft}>
                                <FileText size={18} color="#6B7280" />
                                <Text style={styles.rowLabelText}>Architecture Type</Text>
                            </View>
                            <Text style={styles.rowValueText}>Hermes (Optimized)</Text>
                        </View>
                    </View>

                    {/* SECTION 2: RECENT CHANGELOG */}
                    <Text style={styles.sectionLabel}>RECENT CHANGELOG</Text>
                    <View style={styles.cardGroup}>
                        <View style={styles.changelogItem}>
                            <Text style={styles.changelogTitle}>• Performance Polish</Text>
                            <Text style={styles.changelogDescription}>
                                Optimized deep metric processing loops and enhanced lazy loading routines across sub-dashboards.
                            </Text>
                        </View>
                        <View style={[styles.changelogItem, styles.lastRow]}>
                            <Text style={styles.changelogTitle}>• General UI Fixes</Text>
                            <Text style={styles.changelogDescription}>
                                Squashed visual clipping bugs inside form element labels and improved text viewport clipping rules.
                            </Text>
                        </View>
                    </View>

                    {/* FOOTER */}
                    <Text style={styles.legalFooterText}>
                        © 2026 Metrics App Inc. All rights reserved.
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
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
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

    // ================= CONTENT BODY =================
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },

    // HERO SUMMARY CARD
    versionHeroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FED7AA',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 25,
        marginBottom: 12,
    },

    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#E65F2B',
    },

    heroVersionNum: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
    },

    heroBuildNum: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9CA3AF',
        marginTop: 4,
    },

    // SECTION LABELS
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4,
    },

    // STRUCTURE CONTAINERS
    cardGroup: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    // SPECIFICATION ROW ELEMENTS
    specificationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    rowLabelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },

    rowValueText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },

    // CHANGELOG CARD WRAPPER
    changelogItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    changelogTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },

    changelogDescription: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
    },

    lastRow: {
        borderBottomWidth: 0,
    },

    // LEGAL FOOTER
    legalFooterText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
    },
});