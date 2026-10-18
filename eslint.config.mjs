import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Feature-Sliced Design: a layer may only import from layers below it.
// app -> widgets -> features -> entities -> shared
const layersAbove = {
  shared: ["entities", "features", "widgets"],
  entities: ["features", "widgets"],
  features: ["widgets"],
};

const fsdLayerRules = Object.entries(layersAbove).map(([layer, forbidden]) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: forbidden.map((upper) => ({
          group: [`@/${upper}`, `@/${upper}/*`],
          message: `FSD: "${layer}" must not import from "${upper}" (layers only import downward).`,
        })),
      },
    ],
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...fsdLayerRules,
  {
    // Server code may log (e.g. which model served a request); client code may not.
    files: ["src/**/*.{ts,tsx}"],
    rules: { "no-console": "error" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
