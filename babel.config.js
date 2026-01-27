module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/component',
          '@screens': './src/screen',
          '@redux': './src/redux',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@theme': './src/theme',
          '@types': './src/types',
          '@hooks': './src/hook',
          '@navigators': './src/navigators',
          '@services': './src/services',
          '@routes': './src/routes',
        },
      },
    ],
    'react-native-reanimated/plugin', // 👈 always last
  ],
};
