import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';

import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';

import {
    ArrowLeft,
    MailCheck
} from 'lucide-react-native';

// Import the specialized keyboard scrolling view module
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';

export default function EmailSupport() {
    const router = useRouter();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // Create a reference pointer for the message box to handle keyboard 'Next' actions smoothly
    const messageInputRef = useRef<TextInput>(null);

    const handleSendEmail = () => {
        if (!subject.trim() || !message.trim()) {
            Alert.alert('Missing Info', 'Please fill out both fields before sending.');
            return;
        }

        Alert.alert(
            'Ticket Created',
            'Your message has been sent successfully. Our support squad will respond within 24 hours.',
            [{ text: 'OK', onPress: () => router.back() }]
        );
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
                        Email Support
                    </Text>

                    <View style={[styles.roundButton, { opacity: 0 }]} pointerEvents="none" />
                </View>

                {/* ================= KEYBOARD-AWARE SCROLL VIEW ================= */}
                <KeyboardAwareScrollView
                    style={styles.keyboardScrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    // Configuration tweaks for snappier viewport positioning:
                    enableOnAndroid={true}
                    extraScrollHeight={40}
                    extraHeight={120}
                >
                    {/* ================= HERO CARD ================= */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.mailIconContainer}>
                                <MailCheck size={40} color="#E65F2B" />
                            </View>
                        </View>

                        <Text style={styles.userName}>
                            Submit a Ticket
                        </Text>

                        <Text style={styles.membershipText}>
                            Have a feature inquiry, app bug report, or billing question? Send a note directly to our metrics queue.
                        </Text>
                    </View>

                    {/* ================= INPUT FORM AREA ================= */}
                    <Text style={styles.sectionLabel}>Inquiry Specifications</Text>

                    {/* SUBJECT INPUT */}
                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Subject Topic</Text>
                        <TextInput
                            style={styles.singleInput}
                            placeholder="e.g., Price tracking metrics issue"
                            placeholderTextColor="#9CA3AF"
                            value={subject}
                            onChangeText={setSubject}
                            returnKeyType="next"
                            onSubmitEditing={() => messageInputRef.current?.focus()}
                            blurOnSubmit={false}
                        />
                    </View>

                    {/* MESSAGE BOX MULTILINE */}
                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Message Body Details</Text>
                        <TextInput
                            ref={messageInputRef}
                            style={styles.multiInput}
                            placeholder="Describe your inquiry with as much structural detail as possible..."
                            placeholderTextColor="#9CA3AF"
                            multiline={true}
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>

                    {/* ================= SUBMIT ACTION BUTTON ================= */}
                    <TouchableOpacity
                        style={styles.primaryActionButton}
                        onPress={handleSendEmail}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>
                            Send Support Ticket
                        </Text>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },

    keyboardScrollView: {
        flex: 1,
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

    mailIconContainer: {
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

    // ================= SECTION LABEL =================
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

    // ================= FORM FIELDS =================
    formGroup: {
        marginBottom: 16,
    },

    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 6,
        marginLeft: 2,
    },

    singleInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 14,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },

    multiInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        height: 140,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 14,
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },

    // ================= SUBMIT BUTTON =================
    primaryActionButton: {
        backgroundColor: '#E65F2B',
        borderRadius: 16,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#E65F2B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },

    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});