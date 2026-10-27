import React, { useState, useEffect } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Alert,
    ActivityIndicator
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';

import {
    Camera,
    User,
    Mail,
    Phone,
    Check,
    Image as ImageIcon,
    ChevronRight,
    X
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
    const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
    const [isPickingImage, setIsPickingImage] = useState(false);

    // Safely optimize and compress image to avoid Android memory crashes
    const optimizeImage = async (rawUri: string): Promise<string> => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                rawUri,
                [{ resize: { width: 450 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            return manipResult.uri;
        } catch (e) {
            console.warn('[EditProfile] Image resize skipped, using raw uri:', e);
            return rawUri;
        }
    };

    // Recover pending camera result if Android killed MainActivity during camera capture
    useEffect(() => {
        let isMounted = true;
        async function recoverPendingCameraPhoto() {
            try {
                const pending = await ImagePicker.getPendingResultAsync();
                if (pending && 'assets' in pending && Array.isArray(pending.assets) && pending.assets.length > 0 && isMounted) {
                    setIsPickingImage(true);
                    const optimizedUri = await optimizeImage(pending.assets[0].uri);
                    if (isMounted) {
                        setSelectedAvatar(optimizedUri);
                    }
                }
            } catch (err) {
                console.warn('[EditProfile] Pending camera check skipped:', err);
            } finally {
                if (isMounted) setIsPickingImage(false);
            }
        }
        recoverPendingCameraPhoto();
        return () => {
            isMounted = false;
        };
    }, []);

    // Open phone camera to take photo without crashing
    const handleTakePhoto = async () => {
        setIsPhotoModalVisible(false);
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Camera Permission Needed',
                    'Please enable camera permissions in your device settings to take a profile photo.'
                );
                return;
            }

            setIsPickingImage(true);
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: false, // Prevents Android native cropper crash
                quality: 0.6, // Prevents high-resolution OOM memory crash
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const optimizedUri = await optimizeImage(result.assets[0].uri);
                setSelectedAvatar(optimizedUri);
            }
        } catch (error) {
            console.error('[EditProfile] Error taking photo:', error);
            Alert.alert('Camera Error', 'Could not open camera. Please try again.');
        } finally {
            setIsPickingImage(false);
        }
    };

    // Open gallery or files to choose picture safely
    const handlePickFromGallery = async () => {
        setIsPhotoModalVisible(false);
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Gallery Permission Needed',
                    'Please enable photo library access in your device settings to choose a picture.'
                );
                return;
            }

            setIsPickingImage(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false, // Prevents Android native cropper crash
                quality: 0.6,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const optimizedUri = await optimizeImage(result.assets[0].uri);
                setSelectedAvatar(optimizedUri);
            }
        } catch (error) {
            console.error('[EditProfile] Error selecting image:', error);
            Alert.alert('Gallery Error', 'Could not select image. Please try again.');
        } finally {
            setIsPickingImage(false);
        }
    };

    const handleSave = () => {

        setUser({
            fullName,
            email,
            phone,
            avatar: selectedAvatar,
            memberSince: user?.memberSince,
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

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setIsPhotoModalVisible(true)}
                                style={styles.mainAvatarContainer}
                            >

                                <Image
                                    source={{ uri: selectedAvatar }}
                                    style={styles.mainAvatar}
                                />

                                {isPickingImage ? (
                                    <View style={styles.loadingBadge}>
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    </View>
                                ) : (
                                    <View style={styles.cameraBadge}>
                                        <Camera
                                            size={14}
                                            color="#FFFFFF"
                                        />
                                    </View>
                                )}

                            </TouchableOpacity>

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

                {/* ================= PHOTO PICKER MODAL ================= */}
                <Modal
                    visible={isPhotoModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsPhotoModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsPhotoModalVisible(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.modalContent}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={styles.modalHandle} />

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Profile Photo</Text>
                                <Text style={styles.modalSubtitle}>
                                    Take a new photo or select one from files & gallery
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.menuOption}
                                activeOpacity={0.7}
                                onPress={handleTakePhoto}
                            >
                                <View style={[styles.menuIconBox, { backgroundColor: '#FFF5F0' }]}>
                                    <Camera size={22} color="#E65F2B" />
                                </View>
                                <View style={styles.menuTextBox}>
                                    <Text style={styles.menuOptionTitle}>Take Photo</Text>
                                    <Text style={styles.menuOptionSubtitle}>Use your phone camera</Text>
                                </View>
                                <ChevronRight size={18} color="#D1D5DB" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuOption}
                                activeOpacity={0.7}
                                onPress={handlePickFromGallery}
                            >
                                <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
                                    <ImageIcon size={22} color="#15803D" />
                                </View>
                                <View style={styles.menuTextBox}>
                                    <Text style={styles.menuOptionTitle}>Choose from Gallery / Files</Text>
                                    <Text style={styles.menuOptionSubtitle}>Browse photos or stored documents</Text>
                                </View>
                                <ChevronRight size={18} color="#D1D5DB" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                activeOpacity={0.7}
                                onPress={() => setIsPhotoModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    },

    modalHandle: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginBottom: 16,
    },

    modalHeader: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },

    modalSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },

    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    menuIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    menuTextBox: {
        flex: 1,
    },

    menuOptionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },

    menuOptionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },

    modalCancelBtn: {
        marginTop: 6,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },

    modalCancelText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4B5563',
    },

    loadingBadge: {
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

});