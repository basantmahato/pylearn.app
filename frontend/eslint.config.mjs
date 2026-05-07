import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Landing page uses intentional inline styles for dynamic, data-driven
    // theming (colours from JS arrays). These cannot be moved to static CSS.
    rules: {
      "react/forbid-component-props": "off",
      "react/no-inline-styles": "off",
      "@typescript-eslint/no-inline-styles": "off",
    },
  },
]);


export default eslintConfig;
