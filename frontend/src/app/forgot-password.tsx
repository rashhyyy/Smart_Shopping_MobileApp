import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
// Professional vector icon packs built into Expo
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      {/* THE ONLY BACKGROUND IMAGE ASSET */}
      <Image
        source={require('../../assets/images/login-bg.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#212121" />
          </TouchableOpacity>
        </View>

        {/* Figma Central Lock and Mail Badge Component */}
        <View style={styles.centerBadgeWrapper}>
          <View style={styles.lockBadgeContainer}>
            <Ionicons name="lock-closed" size={54} color="#F25C22" />
            <View style={styles.mailOverlayBadge}>
              <Ionicons name="mail" size={16} color="#F25C22" />
            </View>
          </View>
        </View>

        {/* Forgot Password Typography Header */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Forgot</Text>
          <Text style={styles.backText}>Password?</Text>
          <Text style={styles.subTagline}>
            No worries! Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {/* Main Content Fields */}
        <View style={styles.formCard}>

          {/* Email Address Input */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#F25C22" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email address"
              placeholderTextColor="#BABABA"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Send Reset Link Main Action Button */}
          <TouchableOpacity style={styles.sendButton} activeOpacity={0.9}>
            <Text style={styles.sendButtonText}>Send Reset Link</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.sendArrow} />
          </TouchableOpacity>

          {/* Privacy Notice Row */}
          <View style={styles.privacyRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#F25C22" style={styles.privacyIcon} />
            <Text style={styles.privacyText}>We'll never share your email with anyone.</Text>
          </View>

          {/* Middle Divider Layout */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Contact Support Premium Help Button Row */}
          <TouchableOpacity
            style={styles.supportButton}
            activeOpacity={0.7}
            onPress={() => router.push('/help-and-support')}
          >
            <View style={styles.supportLeftContent}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#F25C22"
                style={styles.supportIcon}
              />
              <Text style={styles.supportButtonText}>
                Need help? <Text style={styles.supportLinkText}>Contact Support</Text>
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#A0A0A0"
            />
          </TouchableOpacity>

          {/* Bottom Footer Back to Sign In Layer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
              <Text style={styles.signInText}>Sign In  ›</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
    position: 'relative',
    zIndex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
    zIndex: 0,
    opacity: 0.3,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 40,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  centerBadgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  lockBadgeContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#FFF1EB',
    borderRadius: 65, // Clean round presentation circle layout
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE0D3',
    position: 'relative',
  },
  mailOverlayBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE0D3',
    elevation: 2,
    shadowColor: '#F25C22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeContainer: {
    alignItems: 'center', // Center text headers matching screenshot context blueprint
    marginBottom: 26,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  backText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#F25C22',
    letterSpacing: -0.5,
    marginTop: -4,
    textAlign: 'center',
  },
  subTagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 20,
    marginTop: 12,
    maxWidth: '90%',
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 22,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.85,
  },
  textInput: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '500',
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: '#F25C22',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 3,
    shadowColor: '#F25C22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 18,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  sendArrow: {
    marginLeft: 6,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 28,
  },
  privacyIcon: {
    marginRight: 6,
    opacity: 0.8,
  },
  privacyText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A0A0',
    paddingHorizontal: 12,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    width: '100%',
    height: 54,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  supportLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportIcon: {
    marginRight: 10,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  supportLinkText: {
    color: '#F25C22',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  signInText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F25C22',
  },
});