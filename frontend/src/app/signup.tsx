import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  ActivityIndicator,
  Animated,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
// Professional vector icon packs built into Expo
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import GoogleAccountChooserModal, { GoogleAccountItem } from '../components/GoogleAccountChooserModal';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, registerUser, registeredUsers, isLoggedIn, isLoadingSession } = useUser();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);

  useEffect(() => {
    if (!isLoadingSession && isLoggedIn && !isSuccessModalVisible) {
      router.replace('/home');
    }
  }, [isLoadingSession, isLoggedIn, isSuccessModalVisible]);

  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const handleGoogleAuth = () => {
    setIsGoogleModalVisible(true);
  };

  const handleSelectGoogleAccount = (account: GoogleAccountItem) => {
    setIsGoogleModalVisible(false);
    if (registerUser) {
      registerUser({
        fullName: account.fullName,
        email: account.email,
        password: 'GoogleOAuthUser123!',
      });
    }
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

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSuccessModalVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0.8);
    }
  }, [isSuccessModalVisible]);

  const navigateToHome = () => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    setIsSuccessModalVisible(false);
    router.replace('/home');
  };

  const handleSignUp = () => {
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please create a password');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password is weak. It must be at least 8 characters long');
      return;
    }

    if (!confirmPassword) {
      setErrorMessage('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isAgreed) {
      setErrorMessage('Please agree to the Terms of Service to continue');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (registerUser) {
        console.log('[SignUp] Registering user account:', email.trim());
        registerUser({
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
        });
      }

      setIsSuccessModalVisible(true);
      setCountdown(2);

      let timeLeft = 2;
      intervalTimerRef.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0 && intervalTimerRef.current) {
          clearInterval(intervalTimerRef.current);
        }
      }, 1000);

      redirectTimerRef.current = setTimeout(() => {
        navigateToHome();
      }, 2000);
    }, 500);
  };

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

          {/* Clean Premium Vector Avatar Display from Figma UI */}
          <View style={styles.avatarBadgeContainer}>
            <Feather name="user" size={38} color="#F25C22" />
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Welcome Header Typography */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Create</Text>
          <Text style={styles.backText}>Account!</Text>
          <Text style={styles.subTagline}>
            Sign up today to start tracking prices and unlocking smart analytics.
          </Text>
        </View>

        {/* Interactive White Input Form Card */}
        <View style={styles.formCard}>
          
          {/* Full Name Input Field */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#F25C22" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor="#BABABA"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

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
              onChangeText={setEmail}
            />
          </View>

          {/* Create Password Input Field */}
          <Text style={styles.inputLabel}>Create Password</Text>
          <View style={[styles.inputWrapper, password.length > 0 && styles.inputWrapperWithFeedback]}>
            <Ionicons name="lock-closed-outline" size={20} color="#F25C22" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Create a password (min 8 chars)"
              placeholderTextColor="#BABABA"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
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

          {/* Password Strength Indicator based on 8 characters */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthTitle}>Password Strength</Text>
                <View
                  style={[
                    styles.strengthBadge,
                    password.length >= 8 ? styles.strengthBadgeStrong : styles.strengthBadgeWeak,
                  ]}
                >
                  <Ionicons
                    name={password.length >= 8 ? "checkmark-circle" : "shield-outline"}
                    size={13}
                    color={password.length >= 8 ? "#059669" : "#DC2626"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.strengthBadgeText,
                      password.length >= 8
                        ? styles.strengthBadgeTextStrong
                        : styles.strengthBadgeTextWeak,
                    ]}
                  >
                    {password.length >= 8 ? 'Strong' : 'Weak'}
                  </Text>
                </View>
              </View>

              {/* Strength Visual Bar */}
              <View style={styles.strengthBarTrack}>
                <View
                  style={[
                    styles.strengthBarSegment,
                    password.length >= 8 ? styles.strengthBarStrong : styles.strengthBarWeak,
                  ]}
                />
                <View
                  style={[
                    styles.strengthBarSegment,
                    password.length >= 8 ? styles.strengthBarStrong : styles.strengthBarInactive,
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.strengthHint,
                  password.length >= 8 ? styles.strengthHintStrong : styles.strengthHintWeak,
                ]}
              >
                {password.length >= 8
                  ? '✓ Strong password (8+ characters)'
                  : `${8 - password.length} more character${8 - password.length === 1 ? '' : 's'} needed for a strong password (${password.length}/8)`}
              </Text>
            </View>
          )}

          {/* Confirm Password Input Field */}
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={[styles.inputWrapper, confirmPassword.length > 0 && styles.inputWrapperWithFeedback]}>
            <Ionicons name="lock-closed-outline" size={20} color="#F25C22" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm your password"
              placeholderTextColor="#BABABA"
              secureTextEntry={!isConfirmPasswordVisible}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#8E8E93" 
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Match Status */}
          {confirmPassword.length > 0 && (
            <View style={styles.matchContainer}>
              <Ionicons
                name={password === confirmPassword ? "checkmark-circle" : "close-circle"}
                size={14}
                color={password === confirmPassword ? "#059669" : "#DC2626"}
              />
              <Text
                style={[
                  styles.matchText,
                  password === confirmPassword ? styles.matchTextSuccess : styles.matchTextError,
                ]}
              >
                {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}

          {/* Figma Terms and Conditions Row Link */}
          <View style={styles.termsRow}>
            <TouchableOpacity 
              style={[styles.checkbox, isAgreed && styles.checkboxActive]} 
              onPress={() => setIsAgreed(!isAgreed)}
              activeOpacity={0.8}
            >
              {isAgreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>data erasure details.</Text>
            </Text>
          </View>

          {/* Validation Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={18} color="#EF4444" style={styles.errorIcon} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Main Solid Brand Action Button */}
          <TouchableOpacity
            style={[styles.signUpButton, isSubmitting && styles.signUpButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.signUpArrow} />
              </>
            )}
          </TouchableOpacity>

          {/* Form Divider Option Layout */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
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
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
              <Text style={styles.signInText}>Sign In  ›</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Account Created Successfully Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={navigateToHome}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.successIconWrapper}>
              <View style={styles.successIconInner}>
                <Ionicons name="checkmark-sharp" size={38} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Account Created!</Text>
            <Text style={styles.modalSubtitle}>
              Your account was created successfully. Welcome, {fullName || 'there'}!
            </Text>

            <View style={styles.countdownBadge}>
              <ActivityIndicator size="small" color="#F25C22" style={styles.countdownSpinner} />
              <Text style={styles.countdownText}>
                Entering Smart Shopping in {countdown}s...
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalDirectButton}
              activeOpacity={0.85}
              onPress={navigateToHome}
            >
              <Text style={styles.modalDirectButtonText}>Continue to Home</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

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
  avatarBadgeContainer: {
    width: 84,
    height: 84,
    backgroundColor: '#FFF1EB',
    borderRadius: 42, // Perfect circle avatar layout
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
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    paddingRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#F25C22',
    borderColor: '#F25C22',
  },
  termsText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    flex: 1,
  },
  termsLink: {
    color: '#F25C22',
    fontWeight: '500',
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
  signUpButton: {
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
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  signUpArrow: {
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
  signInText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F25C22',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingVertical: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  successIconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#DEF7EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  successIconInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE0D3',
  },
  countdownSpinner: {
    marginRight: 8,
    transform: [{ scale: 0.8 }],
  },
  countdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F25C22',
  },
  modalDirectButton: {
    flexDirection: 'row',
    backgroundColor: '#F25C22',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: '#F25C22',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalDirectButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  inputWrapperWithFeedback: {
    marginBottom: 8,
  },
  strengthContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  strengthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  strengthBadgeWeak: {
    backgroundColor: '#FEE2E2',
  },
  strengthBadgeStrong: {
    backgroundColor: '#D1FAE5',
  },
  strengthBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  strengthBadgeTextWeak: {
    color: '#DC2626',
  },
  strengthBadgeTextStrong: {
    color: '#059669',
  },
  strengthBarTrack: {
    flexDirection: 'row',
    gap: 6,
    height: 5,
    marginBottom: 6,
  },
  strengthBarSegment: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
  strengthBarWeak: {
    backgroundColor: '#EF4444',
  },
  strengthBarStrong: {
    backgroundColor: '#10B981',
  },
  strengthBarInactive: {
    backgroundColor: '#E5E7EB',
  },
  strengthHint: {
    fontSize: 11,
    fontWeight: '500',
  },
  strengthHintWeak: {
    color: '#DC2626',
  },
  strengthHintStrong: {
    color: '#059669',
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  matchTextSuccess: {
    color: '#059669',
  },
  matchTextError: {
    color: '#DC2626',
  },
});
