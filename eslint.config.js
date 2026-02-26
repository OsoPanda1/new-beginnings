// eslint.config.js
import tsEslint from "typescript-eslint";
import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import eslintParserTs from "@typescript-eslint/parser";

export default tsEslint.config(
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["dist/**", "node_modules/**"],

    languageOptions: {
      parser: eslintParserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.app.json"
      }
    },

    plugins: {
      "@typescript-eslint": eslintPluginTs
    },

    // Presets recomendados + estrictos
    extends: [
      ...tsEslint.configs.recommended,
      ...tsEslint.configs.strict
    ],

    rules: {
      /* 🚫 Prohibiciones absolutas */
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-var": "error",
      "prefer-const": "error",

      /* 🔒 Tipado constitucional */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      /* ⚖️ Estilo y consistencia (sin chocar con Prettier) */
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],

      // Las siguientes reglas se delegan a Prettier:
      "semi": "off",
      "quotes": "off",
      "indent": "off",
      "max-len": "off"
    }
  }
);

