module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    '^.+\\.vue$': 'vue-jest', // for Vue single file components
    '^.+\\.jsx?$': 'babel-jest', // for JavaScript/JSX files
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'mjs'], // Add 'mjs' if using ES modules
  testEnvironment: 'jsdom', // Set the test environment to jsdom for DOM testing
};
