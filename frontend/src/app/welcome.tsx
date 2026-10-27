import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  // Removed the useEffect redirect loop so this acts as your true landing home screen

  return (
    <SafeAreaView style={styles.container}>
      {/* Safe status bar configuration for the dashboard */}
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandText}>Smart <Text style={styles.orangeText}>shopping</Text></Text>

        <View style={styles.card}>
          <Text style={styles.text}>This is your original Home Page Content!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Subtle off-white layout background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 18,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 30,
  },
  orangeText: {
    color: '#F25C22', // Matches your splash screen brand orange
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    // Clean modern shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    fontWeight: '500',
  },
});