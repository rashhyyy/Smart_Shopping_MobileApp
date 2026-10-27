import React, { useState } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
    Alert
} from 'react-native';

import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';

import {
    ArrowLeft,
    Settings,
    Scan,
    ShoppingBag,
    Flame,
    ChevronRight,
    HelpCircle,
    Info,
    LogOut,
    Globe,
    DollarSign,
    Bell,
    Tag as TagIcon
} from 'lucide-react-native';

import { useRouter, Link } from 'expo-router';

import { useUser } from '../context/UserContext';

export default function Profile() {

    const router = useRouter();

    const { user, currency, logoutUser } = useUser();

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out of your account?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logoutUser();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    // ================= NOTIFICATION STATES =================

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const [showNotificationToast, setShowNotificationToast] = useState(false);

    const [notificationMessage, setNotificationMessage] = useState('');

    // ================= TOGGLE FUNCTION =================

    const toggleNotifications = () => {

        const newValue = !notificationsEnabled;

        setNotificationsEnabled(newValue);

        setNotificationMessage(
            newValue
                ? 'Notifications On'
                : 'Notifications Off'
        );

        setShowNotificationToast(true);

        setTimeout(() => {

            setShowNotificationToast(false);

        }, 1500);
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/home');
        }
    };

    return (

        <SafeAreaProvider>

            <SafeAreaView
                style={styles.safeArea}
                edges={['top', 'bottom']}
            >

                {/* ================= TOAST ================= */}

                {showNotificationToast && (

                    <View style={styles.toastContainer}>

                        <View style={styles.toastCard}>

                            <Text style={styles.toastText}>
                                {notificationMessage}
                            </Text>

                        </View>

                    </View>

                )}

                {/* ================= HEADER ================= */}

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.roundButton}
                        activeOpacity={0.7}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        onPress={handleBack}
                    >
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Profile
                    </Text>

                    <Link href="/settings" asChild>

                        <TouchableOpacity
                            style={styles.roundButton}
                            activeOpacity={0.7}
                        >
                            <Settings size={22} color="#1F2937" />
                        </TouchableOpacity>

                    </Link>

                </View>

                {/* ================= CONTENT ================= */}

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    {/* ================= PROFILE CARD ================= */}

                    <View style={styles.profileCard}>

                        <View style={styles.avatarContainer}>

                            <Image
                                source={{
                                    uri: user.avatar
                                }}
                                style={styles.avatarImage}
                            />

                            <View style={styles.checkmarkBadge}>
                                <Text style={styles.checkmarkText}>✓</Text>
                            </View>

                        </View>

                        <Text style={styles.userName}>
                            {user.fullName}
                        </Text>

                        <Text style={styles.userEmail}>
                            {user.email}
                        </Text>

                        <Text style={styles.userPhone}>
                            {user.phone}
                        </Text>

                        <Text style={styles.membershipText}>
                            Member since March 2025
                        </Text>

                        {/* ================= EDIT BUTTON ================= */}

                        <Link href="/edit-profile" asChild>

                            <TouchableOpacity
                                style={styles.editButton}
                                activeOpacity={0.8}
                            >

                                <Text style={styles.editButtonText}>
                                    Edit Profile
                                </Text>

                            </TouchableOpacity>

                        </Link>

                    </View>

                    {/* ================= DASHBOARD GRID ================= */}

                    <View style={styles.gridContainer}>

                        <View style={styles.gridCard}>

                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: '#FFF5F0' }
                                ]}
                            >
                                <Scan size={18} color="#E65F2B" />
                            </View>

                            <Text style={styles.gridValue}>
                                847
                            </Text>

                            <Text style={styles.gridLabel}>
                                Scans
                            </Text>

                        </View>

                        <View style={styles.gridCard}>

                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: '#F0FDF4' }
                                ]}
                            >
                                <ShoppingBag size={18} color="#15803D" />
                            </View>

                            <Text style={styles.gridValue}>
                                1,324
                            </Text>

                            <Text style={styles.gridLabel}>
                                Items
                            </Text>

                        </View>

                        <View style={styles.gridCard}>

                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: '#FFFBEB' }
                                ]}
                            >
                                <Text style={styles.coinEmoji}>🪙</Text>
                            </View>

                            <Text style={styles.gridValue}>
                                {currency?.symbol || '$'}12,847
                            </Text>

                            <Text style={styles.gridLabel}>
                                Saved
                            </Text>

                        </View>

                        <View style={styles.gridCard}>

                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: '#FDF2F8' }
                                ]}
                            >
                                <Flame size={18} color="#DB2777" />
                            </View>

                            <Text style={styles.gridValue}>
                                12d
                            </Text>

                            <Text style={styles.gridLabel}>
                                Streak
                            </Text>

                        </View>

                    </View>

                    {/* ================= LIST SECTION ================= */}

                    <View style={styles.listSection}>

                        {/* SHOPPING HISTORY */}
                        <Link href="/shopping-history" asChild>
                            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>

                                <View style={styles.listItemLeft}>

                                    <ShoppingBag
                                        size={20}
                                        color="#4B5563"
                                    />

                                    <Text style={styles.listItemText}>
                                        Shopping History
                                    </Text>

                                </View>

                                <ChevronRight
                                    size={18}
                                    color="#9CA3AF"
                                />

                            </TouchableOpacity>
                        </Link>

                        {/* MY SCANS */}
                        <Link href="/my-scans" asChild>
                            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>

                                <View style={styles.listItemLeft}>

                                    <Scan
                                        size={20}
                                        color="#4B5563"
                                    />

                                    <Text style={styles.listItemText}>
                                        My Scans
                                    </Text>

                                </View>

                                <ChevronRight
                                    size={18}
                                    color="#9CA3AF"
                                />

                            </TouchableOpacity>
                        </Link>

                        {/* SAVED DISCOUNTS */}
                        <Link href="/saved-discounts" asChild>
                            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>

                                <View style={styles.listItemLeft}>

                                    <TagIcon
                                        size={20}
                                        color="#4B5563"
                                    />

                                    <Text style={styles.listItemText}>
                                        Saved Discounts
                                    </Text>

                                </View>

                                <ChevronRight
                                    size={18}
                                    color="#9CA3AF"
                                />

                            </TouchableOpacity>
                        </Link>

                    </View>

                    {/* ================= SETTINGS SECTION ================= */}

                    <View style={styles.listSection}>

                        {/* NOTIFICATIONS TOGGLE */}

                        <View style={styles.listItem}>

                            <View style={styles.listItemLeft}>

                                <Bell
                                    size={20}
                                    color="#4B5563"
                                />

                                <Text style={styles.listItemText}>
                                    Notifications
                                </Text>

                            </View>

                            <Switch
                                value={notificationsEnabled}
                                onValueChange={toggleNotifications}
                                trackColor={{
                                    false: '#D1D5DB',
                                    true: '#FDBA74',
                                }}
                                thumbColor={
                                    notificationsEnabled
                                        ? '#E65F2B'
                                        : '#FFFFFF'
                                }
                            />

                        </View>

                        {/* LANGUAGE */}

                        {/* LANGUAGE LINK */}
                        <Link href="/language" asChild>
                            <TouchableOpacity style={styles.listItem}>

                                <View style={styles.listItemLeft}>

                                    <Globe
                                        size={20}
                                        color="#4B5563"
                                    />

                                    <Text style={styles.listItemText}>
                                        Language
                                    </Text>

                                </View>

                                <ChevronRight
                                    size={18}
                                    color="#9CA3AF"
                                />

                            </TouchableOpacity>
                        </Link>

                        {/* CURRENCY */}

                        <Link href="/currency" asChild>
                            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>

                                <View style={styles.listItemLeft}>

                                    <DollarSign
                                        size={20}
                                        color="#4B5563"
                                    />

                                    <Text style={styles.listItemText}>
                                        Currency
                                    </Text>

                                </View>

                                <View style={styles.listItemRight}>
                                    <Text style={styles.currencyBadgeText}>
                                        {currency?.code || 'USD'} ({currency?.symbol || '$'})
                                    </Text>
                                    <ChevronRight
                                        size={18}
                                        color="#9CA3AF"
                                    />
                                </View>

                            </TouchableOpacity>
                        </Link>

                    </View>

                    {/* ================= SUPPORT SECTION ================= */}

                    <View style={styles.listSection}>

                        <Link href="/help-and-support" asChild>
                            <TouchableOpacity style={styles.listItem}>

                                <View style={styles.listItemLeft}>

                                    <HelpCircle
                                        size={20}
                                        color="#4B5563"
                                    />

                                    <Text style={styles.listItemText}>
                                        Help & Support
                                    </Text>

                                </View>

                                <ChevronRight
                                    size={18}
                                    color="#9CA3AF"
                                />

                            </TouchableOpacity>
                        </Link>

                        {/* ABOUT */}
                        <Link href="/about" asChild>
                            <TouchableOpacity style={styles.listItem}>

                                <View style={styles.listItemLeft}>

                                    <Info
                                        size={20}
                                        color="#4B5563"
                                    />

                                    <Text style={styles.listItemText}>
                                        About
                                    </Text>

                                </View>

                                <ChevronRight
                                    size={18}
                                    color="#9CA3AF"
                                />

                            </TouchableOpacity>
                        </Link>

                        <TouchableOpacity
                            style={[
                                styles.listItem,
                                styles.lastItem
                            ]}
                            onPress={handleLogout}
                            activeOpacity={0.7}
                        >

                            <View style={styles.listItemLeft}>

                                <LogOut
                                    size={20}
                                    color="#E11D48"
                                />

                                <Text
                                    style={[
                                        styles.listItemText,
                                        { color: '#E11D48' }
                                    ]}
                                >
                                    Log Out
                                </Text>

                            </View>

                            <ChevronRight
                                size={18}
                                color="#9CA3AF"
                            />

                        </TouchableOpacity>

                    </View>

                    {/* ================= FOOTER ================= */}

                    <Text style={styles.footerVersion}>
                        Smart Shopping v2.4.1
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

    // ================= TOAST =================

    toastContainer: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        zIndex: 999,
        alignItems: 'center',
    },

    toastCard: {
        backgroundColor: '#4B5563',
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,

        elevation: 5,
    },

    toastText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    // ================= CONTENT =================

    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },

    // ================= PROFILE CARD =================

    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },

    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E5E7EB',
    },

    checkmarkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#E65F2B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    checkmarkText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
    },

    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },

    userEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },

    userPhone: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },

    membershipText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },

    editButton: {
        width: '100%',
        backgroundColor: '#1F2937',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 16,
    },

    editButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    // ================= GRID =================

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },

    gridCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    iconBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    coinEmoji: {
        fontSize: 16,
    },

    gridValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },

    gridLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },

    // ================= LIST =================

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
    },

    listItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },

    listItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    currencyBadgeText: {
        fontSize: 13,
        color: '#E65F2B',
        fontWeight: '600',
        marginRight: 6,
    },

    // ================= FOOTER =================

    footerVersion: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 12,
    },

});