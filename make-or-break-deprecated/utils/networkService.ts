import NetInfo from "@react-native-community/netinfo";

export type NetworkState = {
  isConnected: boolean;
  type: string;
  isWiFi: boolean;
};

/**
 * Check if device is connected to WiFi
 */
export async function isWiFiConnected(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.type === "wifi";
  } catch (error) {
    console.error("Error checking WiFi connection:", error);
    return false;
  }
}

/**
 * Check if device has any network connection
 */
export async function isConnected(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true;
  } catch (error) {
    console.error("Error checking connection:", error);
    return false;
  }
}

/**
 * Get current network state
 */
export async function getNetworkState(): Promise<NetworkState> {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected === true,
      type: state.type,
      isWiFi: state.isConnected === true && state.type === "wifi",
    };
  } catch (error) {
    console.error("Error getting network state:", error);
    return {
      isConnected: false,
      type: "unknown",
      isWiFi: false,
    };
  }
}

/**
 * Listen for network state changes
 * Returns unsubscribe function
 */
export function subscribeToNetworkChanges(
  callback: (state: NetworkState) => void
): () => void {
  return NetInfo.addEventListener((state) => {
    callback({
      isConnected: state.isConnected === true,
      type: state.type,
      isWiFi: state.isConnected === true && state.type === "wifi",
    });
  });
}
