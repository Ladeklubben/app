import type { CapacitorConfig } from '@capacitor/cli';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

const isDevelopment = process.env.MODE === 'dev';
const localIp = process.env.IP;

const config: CapacitorConfig = {
  appId: 'dk.ladeklubben.apps',
  appName: 'Ladeklubben',
  webDir: 'build',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },

  // Only add server config in development mode
  ...(isDevelopment && {
    server: {
      url: `http://${localIp}:5173`,
      cleartext: true,
    }
  })
};

export default config;