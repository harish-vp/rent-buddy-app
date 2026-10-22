module.exports = {
  project: {
    android: {
      sourceDir: './android',
      manifestPath: './app/src/main/AndroidManifest.xml',
      packageName: 'com.rentbudy.app',
      appName: 'app',
    },
    ios: {
      sourceDir: './ios',
    },
  },
  assets: ['./assets/fonts/'],
};