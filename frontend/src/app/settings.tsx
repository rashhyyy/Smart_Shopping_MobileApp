import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Volume2, Fingerprint, Sparkles, Info, RefreshCw, DollarSign, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function Settings() {
    const router = useRouter();
    const { currency } = useUser();

    // Preference Toggle States matching video layout choices
    const [notifications, setNotifications] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);
    const [hapticFeedback, setHapticFeedback] = useState(true);
    const [autoScan, setAutoScan] = useState(true);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header Navigation Bar */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings Configuration Containers */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* SECTION 1: APP PREFERENCES */}
                    <Text style={styles.sectionLabel}>APP PREFERENCES</Text>
                    <View style={styles.cardGroup}>
                        <View style={styles.settingRow}>
                            <View style={styles.rowLeft}>
                                <Bell size={20} color="#4B5563" />
                                <Text style={styles.settingName}>Notifications</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                                thumbColor={notifications ? '#E65F2B' : '#F3F4F6'}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.rowLeft}>
                                <Volume2 size={20} color="#4B5563" />
                                <Text style={styles.settingName}>Sound Effects</Text>
                            </View>
                            <Switch
                                value={soundEffects}
                                onValueChange={setSoundEffects}
                                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                                thumbColor={soundEffects ? '#E65F2B' : '#F3F4F6'}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.rowLeft}>
                                <Fingerprint size={20} color="#4B5563" />
                                <Text style={styles.settingName}>Haptic Feedback</Text>
                            </View>
                            <Switch
                                value={hapticFeedback}
                                onValueChange={setHapticFeedback}
                                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                                thumbColor={hapticFeedback ? '#E65F2B' : '#F3F4F6'}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.rowLeft}>
                                <Sparkles size={20} color="#4B5563" />
                                <Text style={styles.settingName}>Auto Scan on Open</Text>
                            </View>
                            <Switch
                                value={autoScan}
                                onValueChange={setAutoScan}
                                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                                thumbColor={autoScan ? '#E65F2B' : '#F3F4F6'}
                            />
                        </View>

                        {/* CURRENCY PREFERENCE */}
                        <TouchableOpacity
                            style={[styles.settingRow, styles.lastRow]}
                            activeOpacity={0.6}
                            onPress={() => router.push('/currency')}
                        >
                            <View style={styles.rowLeft}>
                                <DollarSign size={20} color="#4B5563" />
                                <Text style={styles.settingName}>Currency</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.valueText}>
                                    {currency?.code || 'USD'} ({currency?.symbol || '$'})
                                </Text>
                                <ChevronRight size={16} color="#9CA3AF" style={{ marginLeft: 6 }} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* SECTION 2: ABOUT */}
                    <Text style={styles.sectionLabel}>ABOUT</Text>
                    <View style={styles.cardGroup}>

                        {/* CLICKABLE VERSION ROW LINK */}
                        <TouchableOpacity
                            style={styles.settingRow}
                            activeOpacity={0.6}
                            onPress={() => router.push('/version')}
                        >
                            <View style={styles.rowLeft}>
                                <Info size={20} color="#4B5563" />
                                <Text style={styles.settingName}>Version</Text>
                            </View>
                            <Text style={styles.valueText}>2.4.1</Text>
                        </TouchableOpacity>

                        {/* CLICKABLE CHECK FOR UPDATES ROW LINK */}
                        <TouchableOpacity
                            style={[styles.settingRow, styles.lastRow]}
                            activeOpacity={0.6}
                            onPress={() => router.push('/check-updates')}
                        >
                            <View style={styles.rowLeft}>
                                <RefreshCw size={18} color="#4B5563" />
                                <Text style={styles.settingName}>Check for Updates</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    // =====================================================
    // SAFE AREA
    // =====================================================

    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // =====================================================
    // HEADER
    // =====================================================

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 20,
        paddingVertical: 16,

        backgroundColor: '#FFFFFF',

        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    // Cancel Button Text
    cancelText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
    },

    // Done Button Text
    doneText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E65F2B',
    },

    // Header Title
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },

    // =====================================================
    // SCROLL VIEW
    // =====================================================

    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,

        backgroundColor: '#FAFAFA',
    },

    // =====================================================
    // SECTION LABEL
    // =====================================================

    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',

        letterSpacing: 0.5,

        marginBottom: 8,
        marginLeft: 4,
    },

    // =====================================================
    // CARD GROUP
    // =====================================================

    cardGroup: {
        backgroundColor: '#FFFFFF',

        borderRadius: 20,

        paddingHorizontal: 16,

        marginBottom: 24,

        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    // =====================================================
    // SETTING ROW
    // =====================================================

    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingVertical: 16,

        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    // Last Row Without Border
    lastRow: {
        borderBottomWidth: 0,
    },

    // =====================================================
    // LEFT SIDE CONTENT
    // =====================================================

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 12,
    },

    // Setting Name Text
    settingName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },

    // Right Side Value Text
    valueText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#6B7280',
    },

});