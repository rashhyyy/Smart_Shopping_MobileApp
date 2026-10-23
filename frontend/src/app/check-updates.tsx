import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Animated, Easing } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CheckUpdates() {
    const router = useRouter();

    // States: 'idle' | 'checking' | 'latest' | 'error'
    const [status, setStatus] = useState<'idle' | 'checking' | 'latest' | 'error'>('idle');
    const rotateValue = React.useRef(new Animated.Value(0)).current;

    // Spin animation logic for the loading icon
    const startSpinning = () => {
        rotateValue.setValue(0);
        Animated.loop(
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const handleCheckForUpdates = () => {
        setStatus('checking');
        startSpinning();

        // Simulate a network API request to check versions
        setTimeout(() => {
            // Toggle between 'latest' or 'error' to test different screens
            setStatus('latest');
        }, 2500);
    };

    const spin = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

                {/* ================= HEADER ================= */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
                        <ArrowLeft size={22} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Software Update</Text>
                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                {/* ================= DYNAMIC CONTROLLER APP STATES ================= */}
                <View style={styles.container}>

                    {/* STATE 1: IDLE / READY TO CHECK */}
                    {status === 'idle' && (
                        <View style={styles.stateWrapper}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FFF5F0' }]}>
                                <RefreshCw size={40} color="#E65F2B" />
                            </View>
                            <Text style={styles.titleText}>Update Checker</Text>
                            <Text style={styles.descriptionText}>
                                Click below to query our deployment servers and see if there is a newer dashboard build configuration available.
                            </Text>
                        </View>
                    )}

                    {/* STATE 2: CHECKING IN PROGRESS */}
                    {status === 'checking' && (
                        <View style={styles.stateWrapper}>
                            <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }], backgroundColor: '#FFF5F0' }]}>
                                <RefreshCw size={40} color="#E65F2B" />
                            </Animated.View>
                            <Text style={styles.titleText}>Checking for Updates...</Text>
                            <Text style={styles.descriptionText}>
                                Verifying production manifests, caching digital handshake tokens, and evaluating patch logs.
                            </Text>
                        </View>
                    )}

                    {/* STATE 3: ALREADY LATEST (SUCCESS) */}
                    {status === 'latest' && (
                        <View style={styles.stateWrapper}>
                            <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                                <CheckCircle2 size={42} color="#10B981" />
                            </View>
                            <Text style={styles.titleText}>Your App is Up to Date</Text>
                            <Text style={styles.versionText}>Current Version: 2.4.1 (Stable)</Text>
                            <Text style={styles.descriptionText}>
                                Great news! You are running the newest structural build optimizations available. No actions required.
                            </Text>
                        </View>
                    )}

                    {/* STATE 4: ERROR / OFFLINE */}
                    {status === 'error' && (
                        <View style={styles.stateWrapper}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                                <AlertTriangle size={40} color="#EF4444" />
                            </View>
                            <Text style={styles.titleText}>Connection Timeout</Text>
                            <Text style={styles.descriptionText}>
                                Unable to establish a secure registry index handshake. Check your network internet connection and try again.
                            </Text>
                        </View>
                    )}

                </View>

                {/* ================= FOOTER PERSISTENT ACTION BUTTON ================= */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        style={[
                            styles.primaryActionButton,
                            status === 'checking' && styles.disabledButton
                        ]}
                        onPress={handleCheckForUpdates}
                        disabled={status === 'checking'}
                        activeOpacity={0.8}
                    >
                        {status === 'checking' ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.actionButtonText}>
                                {status === 'latest' ? 'Check Again' : 'Check for Updates'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

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

    // ================= VIEWPORT CONTENT =================
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },

    stateWrapper: {
        alignItems: 'center',
        width: '100%',
    },

    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },

    titleText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },

    versionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },

    descriptionText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },

    // ================= FOOTER SUBMIT ACTIONS =================
    footerContainer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        backgroundColor: '#FAFAFA',
    },

    primaryActionButton: {
        backgroundColor: '#E65F2B',
        borderRadius: 16,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#E65F2B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },

    disabledButton: {
        backgroundColor: '#FFBFA3',
    },

    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});