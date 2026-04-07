import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, process.cwd(), "");
  const sheruEnv = loadEnv(mode, "./sheru-bot", "");
  const geminiApiKey =
    rootEnv.VITE_GEMINI_API_KEY ||
    rootEnv.GEMINI_API_KEY ||
    sheruEnv.VITE_GEMINI_API_KEY ||
    sheruEnv.GEMINI_API_KEY ||
    "";

  return {
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
      },
    },
    assetsInclude: ["**/*.mpeg"],
    define: {
      "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(geminiApiKey),
    },
    plugins: [
      {
        name: "jsx-in-js",
        async transform(code, id) {
          if (!id.includes("/src/") || !id.endsWith(".js")) {
            return null;
          }

          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
          });
        },
      },
      react(),
    ],
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: [".loca.lt"],
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.js",
    },
  };
});
