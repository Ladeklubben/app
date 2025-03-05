import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dk.ladeklubben.app.new',
  appName: 'Ladeklubben',
  webDir: 'build',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
