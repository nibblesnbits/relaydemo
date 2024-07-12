module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['relay'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
