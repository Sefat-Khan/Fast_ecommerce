import { FlatCompat } from "@eslint/eslintrc";
import nextEslint from "next/core-web-vitals";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    js: nextEslint,
  },
});

export default [
  nextEslint,
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
];
