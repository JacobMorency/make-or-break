const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Expo config plugin to exclude react-native-worklets from native linking
 * since react-native-reanimated already includes it
 */
const withExcludeWorkletsLinking = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );

      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, "utf8");

        // Add code to exclude react-native-worklets from autolinking
        const excludeWorklets = `
  # Exclude react-native-worklets from autolinking (included in react-native-reanimated)
  pod 'RNWorklets', :path => '../node_modules/react-native-worklets', :modular_headers => true
  $RCTRootView = nil unless defined?($RCTRootView)
`;

        // Check if the exclusion is already added
        if (
          !podfileContent.includes(
            "Exclude react-native-worklets from autolinking"
          )
        ) {
          // Find the use_react_native line and add our exclusion after it
          podfileContent = podfileContent.replace(
            /(use_react_native![\s\S]*?)(end)/,
            `$1${excludeWorklets}$2`
          );

          fs.writeFileSync(podfilePath, podfileContent);
        }
      }

      return config;
    },
  ]);
};

module.exports = withExcludeWorkletsLinking;
