import React, { useState } from 'react';
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
    Check
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

export default function LanguageSelector() {
    const router = useRouter();

    // ================= LANGUAGE SELECTION STATE =================
    const [selectedLanguageCode, setSelectedLanguageCode] = useState('en');

    // Available languages data array
    const languages = [
        { code: 'en', name: 'English (US)', nativeName: 'English' },
        { code: 'en-gb', name: 'English (UK)', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    ];

    const handleLanguageSelect = (code: string) => {
        setSelectedLanguageCode(code);
        // Add your localization context updates or logic here if needed
    };

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
                        Language
                    </Text>

                    {/* Transparent placeholder to balance out alignment perfectly */}
                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                {/* ================= CONTENT ================= */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.sectionLabel}>Select Application Language</Text>

                    <View style={styles.listSection}>
                        {languages.map((language, index) => {
                            const isSelected = selectedLanguageCode === language.code;
                            const isLastItem = index === languages.length - 1;

                            return (
                                <TouchableOpacity
                                    key={language.code}
                                    style={[
                                        styles.listItem,
                                        isLastItem && styles.lastItem
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => handleLanguageSelect(language.code)}
                                >
                                    <View style={styles.listItemLeft}>
                                        <Text style={styles.listItemText}>
                                            {language.name}
                                        </Text>
                                        <Text style={styles.listItemSubtext}>
                                            {language.nativeName}
                                        </Text>
                                    </View>

                                    {isSelected && (
                                        <View style={styles.checkmarkContainer}>
                                            <Check size={16} color="#FFFFFF" strokeWidth={3} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
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

    // ================= SECTION LABEL =================
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 4,
        marginTop: 16,
        marginBottom: 12,
    },

    // ================= LIST SYSTEM =================
    listSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
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
        flexDirection: 'column',
        justifyContent: 'center',
    },

    listItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },

    listItemSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },

    // ================= CHECKMARK STYLING =================
    checkmarkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E65F2B', // Matching your brand color accent
        justifyContent: 'center',
        alignItems: 'center',
    },
});