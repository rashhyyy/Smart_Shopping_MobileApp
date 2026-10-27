import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';

import {
    ArrowLeft,
    Info,
    ChevronRight,
    Shield,
    FileText,
    Heart
} from 'lucide-react-native';

import { useRouter, Link } from 'expo-router';

export default function About() {
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
                        About
                    </Text>

                    {/* Empty view to perfectly center the title matching your profile layout */}
                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                {/* ================= CONTENT ================= */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ================= APP CARD ================= */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.aboutIconContainer}>
                                <Info size={40} color="#E65F2B" />
                            </View>
                        </View>

                        <Text style={styles.userName}>
                            Smart Shopping
                        </Text>

                        <Text style={styles.userEmail}>
                            Version 2.4.1
                        </Text>

                        <Text style={styles.membershipText}>
                            Your intelligent shopping companion
                        </Text>
                    </View>

                    {/* ================= DESCRIPTION SECTION ================= */}
                    <View style={styles.listSection}>
                        <View style={styles.descriptionPadding}>
                            <Text style={styles.descriptionTitle}>Our Mission</Text>
                            <Text style={styles.descriptionText}>
                                Smart Shopping helps you scan barcodes, track item price metrics,
                                and unlock massive discount savings instantly. We are committed to making
                                everyday shopping more affordable and productive.
                            </Text>
                        </View>
                    </View>

                    {/* ================= LEGAL / INFO LIST ================= */}
                    <View style={styles.listSection}>

                        {/* TERMS OF SERVICE LINK */}
                        <Link href="/terms-of-service" asChild>
                            <TouchableOpacity style={styles.listItem}>
                                <View style={styles.listItemLeft}>
                                    <FileText size={20} color="#4B5563" />
                                    <Text style={styles.listItemText}>
                                        Terms of Service
                                    </Text>
                                </View>
                                <ChevronRight size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        </Link>

                        {/* PRIVACY POLICY LINK */}
                        <Link href="/privacy-policy" asChild>
                            <TouchableOpacity style={styles.listItem}>
                                <View style={styles.listItemLeft}>
                                    <Shield size={20} color="#4B5563" />
                                    <Text style={styles.listItemText}>
                                        Privacy Policy
                                    </Text>
                                </View>
                                <ChevronRight size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        </Link>

                        {/* OPEN SOURCE LICENSES LINK */}
                        <Link href="/open-source-licenses" asChild>
                            <TouchableOpacity style={styles.listItem}>

                                <View style={styles.listItemLeft}>
                                    <Heart size={20} color="#4B5563" />
                                    <Text style={styles.listItemText}>
                                        Open Source Licenses
                                    </Text>
                                </View>


                                <ChevronRight size={18} color="#9CA3AF" />

                            </TouchableOpacity>
                        </Link>

                    </View>

                    {/* ================= FOOTER ================= */}
                    <Text style={styles.footerVersion}>
                        © 2026 Smart Shopping Inc.
                    </Text>
                    <Text style={styles.footerSubtext}>
                        All Rights Reserved.
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

    // ================= APP / PROFILE CARD =================
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
        position: 'relative',
        marginBottom: 16,
    },

    aboutIconContainer: {
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
    },

    // ================= DESCRIPTION =================
    descriptionPadding: {
        padding: 16,
    },

    descriptionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },

    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#4B5563',
    },

    // ================= LIST SECTION =================
    listSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
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

    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },

    listItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },

    // ================= FOOTER =================
    footerVersion: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 20,
    },

    footerSubtext: {
        textAlign: 'center',
        color: '#D1D5DB',
        fontSize: 12,
        marginTop: 2,
    },
});