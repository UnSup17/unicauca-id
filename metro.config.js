// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Asegúrate de no sobrescribir `config.resolver` ni `config.transformer`, sino extenderlos correctamente
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

module.exports = config;
