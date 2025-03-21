import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "tailwindcss"; // Add this line

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: 'localhost',
  },
  build: {
    chunkSizeWarningLimit: 1024,
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  optimizeDeps: {
    include: ["tailwind-config"],
    esbuildOptions: {
      loader: {
        '.node': 'file'
      }
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss], // Add this line
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@a": path.resolve(__dirname, "./src/assets"),
      "@c": path.resolve(__dirname, "./src/components"),
      "@p": path.resolve(__dirname, "./src/pages"),
      "@s": path.resolve(__dirname, "./src/stores"),
      "@u": path.resolve(__dirname, "./src/utils"),
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
    },
  },
});
