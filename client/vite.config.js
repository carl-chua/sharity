import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Migrated from Create React App: keep JSX in .js files, the REACT_APP_
// env prefix, the build/ output dir and the dev port working as before.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: { loader: "jsx", include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { ".js": "jsx" } } },
  envPrefix: "REACT_APP_",
  define: { "process.env.PUBLIC_URL": JSON.stringify("") },
  build: { outDir: "build" },
  server: { port: 3000 },
});
