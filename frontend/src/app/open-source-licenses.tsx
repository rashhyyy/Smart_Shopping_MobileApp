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
    Heart
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

export default function OpenSourceLicenses() {
    const router = useRouter();

    // Data array containing active third-party packages matching your app architecture
    const licenses = [
        {
            name: 'React Native',
            version: 'v0.74.x',
            type: 'MIT License',
            copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.'
        },
        {
            name: 'Expo SDK',
            version: 'v51.0.x',
            type: 'MIT License',
            copyright: 'Copyright (c) 2015-present 650 Industries, Inc.'
        },
        {
            name: 'Lucide React Native',
            version: 'v0.379.0',
            type: 'ISC License',
            copyright: 'Copyright (c) 2022-present, Lucide Contributors'
        },
        {
            name: 'React Native Safe Area Context',
            version: 'v4.10.x',
            type: 'MIT License',
            copyright: 'Copyright (c) 2019 Janic Duplessis'
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
                        Licenses
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
                            <View style={styles.heartIconContainer}>
                                <Heart size={40} color="#E65F2B" fill="#E65F2B" />
                            </View>
                        </View>

                        <Text style={styles.userName}>
                            Acknowledgements
                        </Text>

                        <Text style={styles.userEmail}>
                            Open Source software
                        </Text>

                        <Text style={styles.membershipText}>
                            We are incredibly grateful to the global open-source community powering Smart Shopping components.
                        </Text>
                    </View>

                    {/* ================= LICENSE CARDS SYSTEM ================= */}
                    <Text style={styles.sectionLabel}>Third-Party Software Credits</Text>

                    {licenses.map((item, index) => (
                        <View key={index} style={styles.listSection}>
                            <View style={styles.descriptionPadding}>
                                <View style={styles.licenseTitleRow}>
                                    <Text style={styles.descriptionTitle}>{item.name}</Text>
                                    <Text style={styles.versionBadge}>{item.version}</Text>
                                </View>

                                <Text style={styles.licenseType}>{item.type}</Text>
                                <Text style={styles.descriptionText}>{item.copyright}</Text>

                                <Text style={styles.licenseBodyText}>
                                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software
                                    and associated documentation files to deal in the Software without restriction, including without
                                    limitation the rights to use, copy, modify, merge, publish, or distribute.
                                </Text>
                            </View>
                        </View>
                    ))}

                    {/* ================= FOOTER ================= */}
                    <Text style={styles.footerVersion}>
                        Smart Shopping v2.4.1 Production Core
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

    heartIconContainer: {
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

    // ================= REUSABLE LICENSE CONTAINER =================
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

    licenseTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },

    descriptionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },

    versionBadge: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: 'hidden',
    },

    licenseType: {
        fontSize: 13,
        fontWeight: '600',
        color: '#E65F2B',
        marginBottom: 4,
    },

    descriptionText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
        lineHeight: 16,
    },

    licenseBodyText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#9CA3AF',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA',
        paddingTop: 8,
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