import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

export type GoogleAccountItem = {
  fullName: string;
  email: string;
  avatar?: string;
  avatarColor?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccountItem) => void;
  knownAccounts?: GoogleAccountItem[];
};

const DEFAULT_GOOGLE_ACCOUNTS: GoogleAccountItem[] = [
  {
    fullName: 'Uwasara Gunathunga',
    email: 'uwasara.gunathunga@gmail.com',
    avatarColor: '#4285F4',
  },
  {
    fullName: 'Personal Account',
    email: 'uwasara.dev@gmail.com',
    avatarColor: '#EA4335',
  },
  {
    fullName: 'Work Account',
    email: 'uwasara.work@gmail.com',
    avatarColor: '#34A853',
  },
];

export default function GoogleAccountChooserModal({
  visible,
  onClose,
  onSelectAccount,
  knownAccounts = [],
}: Props) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState('');

  // Combine known accounts from registered users with default Google accounts without duplicates
  const allAccounts: GoogleAccountItem[] = [];
  const seenEmails = new Set<string>();

  [...knownAccounts, ...DEFAULT_GOOGLE_ACCOUNTS].forEach((acc) => {
    const normalized = (acc.email || '').trim().toLowerCase();
    if (normalized && !seenEmails.has(normalized)) {
      seenEmails.add(normalized);
      allAccounts.push(acc);
    }
  });

  const handleCustomSubmit = () => {
    setCustomError('');
    const trimmedEmail = customEmail.trim();
    if (!trimmedEmail) {
      setCustomError('Please enter an email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setCustomError('Please enter a valid email address');
      return;
    }

    const name = customName.trim() || trimmedEmail.split('@')[0];
    onSelectAccount({
      fullName: name,
      email: trimmedEmail,
      avatarColor: '#4285F4',
    });
    setCustomName('');
    setCustomEmail('');
    setShowCustomInput(false);
  };

  const handleOpenWebAccountChooser = async () => {
    const webChooserUrl = 'https://accounts.google.com/AccountChooser?prompt=select_account';
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(webChooserUrl, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(webChooserUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        });
      }
    } catch {
      Linking.openURL(webChooserUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalCard}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header with Google Logo */}
          <View style={styles.header}>
            <View style={styles.googleIconCircle}>
              <FontAwesome name="google" size={26} color="#EA4335" />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={22} color="#5F6368" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Choose an account</Text>
          <Text style={styles.subtitle}>to continue to Smart Shopping</Text>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {/* Account List */}
            {allAccounts.map((account, index) => {
              const initial = (account.fullName || account.email || 'G')
                .trim()
                .charAt(0)
                .toUpperCase();
              const badgeColor = account.avatarColor || '#4285F4';

              return (
                <TouchableOpacity
                  key={`${account.email}-${index}`}
                  style={styles.accountRow}
                  activeOpacity={0.7}
                  onPress={() => onSelectAccount(account)}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: badgeColor }]}>
                    <Text style={styles.avatarInitial}>{initial}</Text>
                  </View>
                  <View style={styles.accountDetails}>
                    <Text style={styles.accountName} numberOfLines={1}>
                      {account.fullName}
                    </Text>
                    <Text style={styles.accountEmail} numberOfLines={1}>
                      {account.email}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
                </TouchableOpacity>
              );
            })}

            {/* Custom Email Input Section */}
            {showCustomInput ? (
              <View style={styles.customInputCard}>
                <Text style={styles.customInputTitle}>Sign in with another Google email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Name (Optional)"
                  placeholderTextColor="#9AA0A6"
                  value={customName}
                  onChangeText={setCustomName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="name@gmail.com"
                  placeholderTextColor="#9AA0A6"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={customEmail}
                  onChangeText={(text) => {
                    setCustomEmail(text);
                    if (customError) setCustomError('');
                  }}
                />
                {customError ? (
                  <Text style={styles.customErrorText}>{customError}</Text>
                ) : null}
                <View style={styles.customButtonGroup}>
                  <TouchableOpacity
                    style={styles.cancelCustomButton}
                    onPress={() => {
                      setShowCustomInput(false);
                      setCustomError('');
                    }}
                  >
                    <Text style={styles.cancelCustomText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitCustomButton}
                    onPress={handleCustomSubmit}
                  >
                    <Text style={styles.submitCustomText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.useAnotherRow}
                activeOpacity={0.7}
                onPress={() => setShowCustomInput(true)}
              >
                <View style={styles.addIconCircle}>
                  <Ionicons name="person-add-outline" size={18} color="#1A73E8" />
                </View>
                <Text style={styles.useAnotherText}>Use another Google account</Text>
              </TouchableOpacity>
            )}

            {/* Option to open Google Web Account Chooser directly */}
            <TouchableOpacity
              style={styles.webChooserButton}
              activeOpacity={0.7}
              onPress={handleOpenWebAccountChooser}
            >
              <MaterialCommunityIcons name="web" size={18} color="#5F6368" style={{ marginRight: 8 }} />
              <Text style={styles.webChooserText}>
                Open Google Web Account Chooser
              </Text>
            </TouchableOpacity>

            {/* Google Disclaimer */}
            <Text style={styles.disclaimer}>
              To continue, Google will share your name, email address, language preference, and profile picture with Smart Shopping.
            </Text>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  googleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F3F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 16,
  },
  scrollList: {
    maxHeight: 380,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: 13,
    color: '#5F6368',
  },
  useAnotherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  addIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  useAnotherText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A73E8',
  },
  customInputCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  customInputTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3C4043',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    color: '#202124',
    marginBottom: 8,
  },
  customErrorText: {
    fontSize: 12,
    color: '#D93025',
    marginBottom: 8,
  },
  customButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  cancelCustomButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  cancelCustomText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5F6368',
  },
  submitCustomButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitCustomText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  webChooserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    marginBottom: 14,
  },
  webChooserText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3C4043',
  },
  disclaimer: {
    fontSize: 11,
    color: '#70757A',
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 6,
    marginTop: 6,
    marginBottom: 10,
  },
});
