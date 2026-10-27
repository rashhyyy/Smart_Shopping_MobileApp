import React, { useState, useEffect } from 'react';
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
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
// Professional vector icon packs built into Expo
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import GoogleAccountChooserModal, { GoogleAccountItem } from '../components/GoogleAccountChooserModal';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ registeredEmail?: string; accountCreated?: string }>();
  const { authenticateUser, setUser, registeredUsers } = useUser();

  const [email, setEmail] = useState(params.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleGoogleAuth = () => {
    setIsGoogleModalVisible(true);
  };

  const handleSelectGoogleAccount = (account: GoogleAccountItem) => {
    setIsGoogleModalVisible(false);
    setUser({
      fullName: account.fullName,
      email: account.email,
      phone: '+91 98765 43210',
      avatar:
        account.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    });
    router.replace('/home');
  };

  const handleAppleAuth = async () => {
    const appleUrl = 'https://appleid.apple.com';
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(appleUrl, '_blank');
        setTimeout(() => {
          if (window.confirm('Signed in with Apple? Click OK to continue to Smart Shopping.')) {
            setUser({
              fullName: 'Apple User',
              email: 'apple.user@icloud.com',
              phone: '+91 98765 43210',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            });
            router.replace('/home');
          }
        }, 800);
      } else {
        await WebBrowser.openBrowserAsync(appleUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        });
        Alert.alert(
          'Apple Account',
          'Did you sign in with your Apple account?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Continue to App',
              onPress: () => {
                setUser({
                  fullName: 'Apple User',
                  email: 'apple.user@icloud.com',
                  phone: '+91 98765 43210',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
                });
                router.replace('/home');
              },
            },
          ]
        );
      }
    } catch (err) {
      Linking.openURL(appleUrl);
    }
  };

  const handleSignIn = () => {
    setErrorMessage('');

    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail) {
      const msg = 'Please enter your email address.';
      setErrorMessage(msg);
      showAlert('Sign In Failed', msg);
      return;
    }

    if (!password) {
      const msg = 'Please enter your password.';
      setErrorMessage(msg);
      showAlert('Sign In Failed', msg);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[Login] Verifying credentials for email:', trimmedEmail);
      const authResult = authenticateUser(trimmedEmail, password);
      console.log('[Login] Verification result:', authResult);

      if (!authResult || !authResult.success) {
        setIsSubmitting(false);
        const errorMsg = (authResult && authResult.message) || 'Invalid email or password.';
        setErrorMessage(errorMsg);
        showAlert('Sign In Failed', errorMsg);
        return;
      }

      // Successful authentication -> navigate to /home
      setIsSubmitting(false);
      router.replace('/home');
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMsg = 'An error occurred during sign in. Please try again.';
      setErrorMessage(errorMsg);
      showAlert('Sign In Error', errorMsg);
    }
  };

  useEffect(() => {
    if (params.registeredEmail) {
      setEmail(params.registeredEmail);
    }
  }, [params.registeredEmail]);

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

          {/* Clean Premium Vector Lock Display */}
          <View style={styles.lockBadgeContainer}>
            <Ionicons name="lock-closed" size={36} color="#F25C22" />
            <View style={styles.checkmarkBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Welcome Header Typography */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.backText}>Back!</Text>
          <Text style={styles.subTagline}>
            Sign in to continue saving smart with price tracking metrics.
          </Text>
        </View>

        {/* Interactive White Input Form Card */}
        <View style={styles.formCard}>

          {/* Account Created Success Banner */}
          {params.accountCreated === '1' && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" style={styles.successBannerIcon} />
              <Text style={styles.successBannerText}>
                Your account was created successfully! Please sign in.
              </Text>
            </View>
          )}

          {/* Email Input Field */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#F25C22" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor="#BABABA"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
            />
          </View>

          {/* Password Input Field */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#F25C22" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor="#BABABA"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              value={password}
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link Linked up via Expo Router */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            activeOpacity={0.7}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?  ›</Text>
          </TouchableOpacity>

          {/* Error Message Alert Banner */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={18} color="#EF4444" style={styles.errorIcon} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Main Solid Brand Action Button */}
          <TouchableOpacity
            style={[styles.signInButton, isSubmitting && styles.signInButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.signInButtonText}>Sign In</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={styles.signInArrow}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Form Divider Option Layout */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Authentication Container Row */}
          <View style={styles.socialRow}>
            {/* Google Authentication Button */}
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={handleGoogleAuth}
            >
              <FontAwesome name="google" size={18} color="#EA4335" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            {/* Apple Authentication Button */}
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={handleAppleAuth}
            >
              <FontAwesome name="apple" size={18} color="#000000" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Alternative Bottom Navigation Link Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/signup')}>
              <Text style={styles.signUpText}>Sign Up  ›</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        visible={isGoogleModalVisible}
        onClose={() => setIsGoogleModalVisible(false)}
        onSelectAccount={handleSelectGoogleAccount}
        knownAccounts={(registeredUsers || []).map((u) => ({
          fullName: u.fullName,
          email: u.email,
        }))}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
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
  lockBadgeContainer: {
    width: 84,
    height: 84,
    backgroundColor: '#FFF1EB',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFE0D3',
    elevation: 1,
    shadowColor: '#F25C22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  checkmarkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#F25C22',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  welcomeContainer: {
    marginBottom: 28,
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  backText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#F25C22',
    letterSpacing: -0.5,
    marginTop: -4,
  },
  subTagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 20,
    marginTop: 8,
    maxWidth: '90%',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 30,
    width: '100%',
    elevation: 4,
    shadowColor: '#F25C22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
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
    marginBottom: 20,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F25C22',
  },
  signInButton: {
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
    marginBottom: 26,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  signInArrow: {
    marginLeft: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
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
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 28,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    width: '47%',
    height: 52,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
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
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F25C22',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEF7EC',
    borderWidth: 1,
    borderColor: '#BCF0DA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  successBannerIcon: {
    marginRight: 8,
  },
  successBannerText: {
    color: '#03543F',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
