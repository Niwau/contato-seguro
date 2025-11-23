import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    coverage: {
      provider: "v8"
    },
    environment: "node",
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**"]
  }
});
