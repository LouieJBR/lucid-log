const globals = require("globals");
const pluginJs = require("@eslint/js");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // ✅ Set to CommonJS
      globals: {
        ...globals.node, // ✅ Enables `require`, `module`, and `process`
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-undef": "off", // ✅ Prevents errors for `require` and `process`
      "no-unused-vars": "warn",
      "semi": ["error", "always"],
    },
  },
];
