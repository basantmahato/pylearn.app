import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './api';

// Configure foreground notifications handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // 1. Android Emulators with Google Play Services support notifications, but physical is ideal
  if (!Device.isDevice && Platform.OS !== 'android') {
    console.log('Must use a physical device for push notifications');
    return null;
  }

  try {
    // 2. Request Android notification permissions (specifically required on Android 13+)
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied!');
      return null;
    }

    // 3. Android-specific notification channel settings
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // 4. Get Project ID from Expo config
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
    
    if (!projectId) {
      console.warn('EAS Project ID not found in app.json. Fetching token might fail unless running in local dev or EAS is configured.');
    }

    // 5. Get Expo Push Token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    const token = tokenData.data;
    console.log('Android Push Token:', token);

    // 6. Register token with backend
    await api.registerDeviceToken(token);

    return token;
  } catch (error) {
    console.error('Error setting up push notifications:', error);
    return null;
  }
}
