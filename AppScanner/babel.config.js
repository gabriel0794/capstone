module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        '@babel/plugin-transform-class-properties',
        { loose: true }, // Set loose mode here
      ],
      [
        '@babel/plugin-transform-private-methods',
        { loose: true }, // Same loose mode
      ],
      [
        '@babel/plugin-transform-private-property-in-object',
        { loose: true }, // Same loose mode
      ],
    ],
  };
  