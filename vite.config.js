import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3') || id.includes('node_modules/victory')) return 'vendor-recharts';
          if (id.includes('node_modules/fuse.js') || id.includes('node_modules/html2canvas')) return 'vendor-utils';
          if (id.includes('src/sports/rugby-league')) return 'sport-rugbyleague';
          if (id.includes('src/sports/rugby')) return 'sport-rugby';
          if (id.includes('src/sports/football')) return 'sport-football';
          if (id.includes('src/sports/olympics')) return 'sport-olympics';
          if (id.includes('src/sports/cricket')) return 'sport-cricket';
          if (id.includes('src/sports/athletics')) return 'sport-athletics';
          if (id.includes('src/sports/tennis')) return 'sport-tennis';
          if (id.includes('src/sports/cycling')) return 'sport-cycling';
          if (id.includes('src/sports/gaelic')) return 'sport-gaelic';
          if (id.includes('src/world/elections')) return 'world-elections';
          if (id.includes('src/world/eurovision')) return 'world-eurovision';
          if (id.includes('src/world/nobel')) return 'world-nobel';
          if (id.includes('src/world/demographics')) return 'world-demographics';
          if (id.includes('src/world/economics')) return 'world-economics';
          if (id.includes('src/stories'))        return 'platform-stories';
          if (id.includes('src/components/RecordTracker')) return 'platform-records';
          if (id.includes('src/components/RivalryIndex')) return 'platform-rivalry';
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
