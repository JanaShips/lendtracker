import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lendtracker.app',
  appName: 'LendTracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Load from hosted URL for OTA updates
    // Replace with your Vercel URL after deployment
    url: 'https://lendtracker.vercel.app',
    // url: 'http://localhost:5173', // For local development
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0e17',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0a0e17'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#10b981'
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'LendTracker',
    backgroundColor: '#0a0e17'
  }
};

export default config;
