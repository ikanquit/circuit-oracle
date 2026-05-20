import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "package-lock.json",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // React 19 / eslint-plugin-react-hooks v7 added a strict rule that flags
      // legitimate patterns like mount-flag hydration shims and effect cleanup
      // resets. Downgrade to warning so it surfaces but doesn't break CI.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
