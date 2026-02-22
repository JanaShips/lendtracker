import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lendwise.app',
  appName: 'LendWise',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // For production: load from hosted URL (enables OTA updates). For local/bundled build, comment out url.
    url: 'https://lendwise.vercel.app',
    // url: 'http://localhost:5173', // For local development
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0e17',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      iosSpinnerStyle: 'small',
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
    scheme: 'LendWise',
    backgroundColor: '#0a0e17',
    allowsLinkPreview: false,
    scrollEnabled: true
  },
  android: {
    backgroundColor: '#0a0e17',
    allowMixedContent: true
  }
};

export default config;
