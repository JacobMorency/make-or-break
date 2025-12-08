module.exports = {
  dependencies: {
    "react-native-worklets": {
      platforms: {
        ios: {
          project: null, // Exclude from iOS native linking
        },
        android: {
          sourceDir: null, // Exclude from Android native linking
        },
      },
    },
  },
};
