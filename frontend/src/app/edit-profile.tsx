import React, { useState } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';

import {
    Camera,
    User,
    Mail,
    Phone,
    Check
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

import { useUser } from '../context/UserContext';

const AVATAR_OPTIONS = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
];

export default function EditProfile() {

    const router = useRouter();

    const { user, setUser } = useUser();

    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

    const [fullName, setFullName] = useState(user.fullName);

    const [email, setEmail] = useState(user.email);

    const [phone, setPhone] = useState(user.phone);

    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {

        setUser({
            fullName,
            email,
            phone,
            avatar: selectedAvatar,
        });

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

            router.back();

        }, 1800);
    };

    return (

        <SafeAreaProvider>

            <SafeAreaView
                style={styles.safeArea}
                edges={['top', 'bottom']}
            >

                {showToast && (

                    <View style={styles.toastContainer}>

                        <View style={styles.toastCard}>

                            <Check
                                size={16}
                                color="#15803D"
                                strokeWidth={3}
                            />

                            <Text style={styles.toastText}>
                                Profile saved
                            </Text>

                        </View>

                    </View>

                )}

                <View style={styles.header}>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        disabled={showToast}
                    >
                        <Text style={styles.cancelText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Edit Profile
                    </Text>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={showToast}
                    >
                        <Text style={styles.saveText}>
                            Save
                        </Text>
                    </TouchableOpacity>

                </View>

                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={
                        Platform.OS === 'ios'
                            ? 'padding'
                            : 'height'
                    }
                    keyboardVerticalOffset={
                        Platform.OS === 'ios'
                            ? 0
                            : 20
                    }
                >

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <View style={styles.avatarSection}>

                            <View style={styles.mainAvatarContainer}>

                                <Image
                                    source={{ uri: selectedAvatar }}
                                    style={styles.mainAvatar}
                                />

                                <View style={styles.cameraBadge}>
                                    <Camera
                                        size={14}
                                        color="#FFFFFF"
                                    />
                                </View>

                            </View>

                            <Text style={styles.chooseAvatarTitle}>
                                Choose Avatar
                            </Text>

                            <View style={styles.avatarRow}>

                                {AVATAR_OPTIONS.map((uri, index) => (

                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedAvatar(uri)}
                                        style={[
                                            styles.miniAvatarWrapper,
                                            selectedAvatar === uri &&
                                            styles.activeMiniAvatarWrapper
                                        ]}
                                    >

                                        <Image
                                            source={{ uri }}
                                            style={styles.miniAvatar}
                                        />

                                    </TouchableOpacity>

                                ))}

                            </View>

                        </View>

                        <View style={styles.formSection}>

                            <Text style={styles.fieldLabel}>
                                FULL NAME
                            </Text>

                            <View style={styles.inputContainer}>

                                <User
                                    size={20}
                                    color="#9CA3AF"
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.textInput}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="Enter full name"
                                    placeholderTextColor="#9CA3AF"
                                />

                            </View>

                            <Text style={styles.fieldLabel}>
                                EMAIL ADDRESS
                            </Text>

                            <View style={styles.inputContainer}>

                                <Mail
                                    size={20}
                                    color="#9CA3AF"
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.textInput}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="Enter email address"
                                    placeholderTextColor="#9CA3AF"
                                />

                            </View>

                            <Text style={styles.fieldLabel}>
                                PHONE NUMBER
                            </Text>

                            <View style={styles.inputContainer}>

                                <Phone
                                    size={20}
                                    color="#9CA3AF"
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.textInput}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholder="Enter phone number"
                                    placeholderTextColor="#9CA3AF"
                                />

                            </View>

                        </View>

                    </ScrollView>

                </KeyboardAvoidingView>

            </SafeAreaView>

        </SafeAreaProvider>

    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'relative',
    },

    keyboardContainer: {
        flex: 1,
    },

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

    cancelText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
    },

    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E65F2B',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },

    scrollContent: {
        paddingBottom: 60,
    },

    avatarSection: {
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 20,
    },

    mainAvatarContainer: {
        position: 'relative',
    },

    mainAvatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#E5E7EB',
    },

    cameraBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E65F2B',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    chooseAvatarTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4B5563',
        marginTop: 20,
        marginBottom: 12,
    },

    avatarRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
        maxWidth: 320,
    },

    miniAvatarWrapper: {
        width: 46,
        height: 46,
        borderRadius: 23,
        padding: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    activeMiniAvatarWrapper: {
        borderColor: '#E65F2B',
    },

    miniAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 23,
    },

    formSection: {
        marginTop: 32,
        paddingHorizontal: 24,
        gap: 4,
    },

    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 8,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    inputIcon: {
        marginRight: 12,
    },

    textInput: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },

    toastContainer: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        zIndex: 999,
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    toastCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },

    toastText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#15803D',
    },

});