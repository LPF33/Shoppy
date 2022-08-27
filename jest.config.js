module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  globals: {
    "vue-jest": {
      compilerOptions: {
        isCustomElement(tag) {
          return ["font-awesome-icon"].includes(tag);
        },
      },
    },
  },
};
