const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow .glb later if needed
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
