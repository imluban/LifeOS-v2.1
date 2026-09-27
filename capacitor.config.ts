import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lifeos.app",
  appName: "LifeOS",
  webDir: "www",

  // "Remote" mode: instead of bundling a static export (which can't work
  // here — this app has live server API routes and per-request Supabase
  // auth), the native app shell just loads your real, always-up-to-date
  // Vercel deployment. Replace this with your actual Vercel URL.
  server: {
    url: "https://YOUR-APP-NAME.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
};

export default config;
