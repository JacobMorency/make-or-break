import { storage } from "./asyncStorage";
import Constants from "expo-constants";

const DEVICE_ID_KEY = "deviceId";

/**
 * Get or generate a unique device ID
 * Stores in AsyncStorage for persistence
 */
export async function getDeviceId(): Promise<string> {
  try {
    // Try to get existing device ID
    let deviceId = await storage.getItem<string>(DEVICE_ID_KEY);

    if (!deviceId) {
      // Generate new device ID
      // Use installation ID from expo-constants if available, otherwise generate
      const installationId =
        Constants.installationId || Constants.executionEnvironment;
      const randomSuffix = Math.random().toString(36).substr(2, 9);
      deviceId = `device-${installationId || Date.now()}-${randomSuffix}`;

      // Store for future use
      await storage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error("Error getting device ID:", error);
    // Fallback to timestamp-based ID
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
