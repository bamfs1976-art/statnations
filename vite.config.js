import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Chunking rules are ordered: vendor code first, then the lazily-loaded platform
// panels, then shared app code, then one chunk per section.
//
// The shared-code rule matters more than it looks. Without it, modules the entry
// needs (the shell, the search palette) get swept into whichever section chunk
// rollup happens to pick, and the entry then statically depends on that chunk — so
// every visitor preloaded the 360 KB records/charts bundle before the page painted.
// eslint-disable-next-line no-unused-vars
const chunkFor = (id) => {
  if (id.includes('node_modules/react-dom') || /node_modules\/react(\/|$)/.test(id)) return 'vendor-react';
  if (/(recharts|victory|[/\\]d3-|internmap|delaunator|robust-predicates|decimal\.js-light|react-smooth|react-transition-group|fast-equals|eventemitter3)/.test(id)) return 'vendor-charts';
  if (id.includes('node_modules/fuse.js') || id.includes('node_modules/html2canvas')) return 'vendor-utils';
  if (id.includes('node_modules/lucide-react')) return 'vendor-icons';

  if (id.includes('src/components/RecordTracker')) return 'platform-records';
  if (id.includes('src/components/RivalryIndex')) return 'platform-rivalry';
  if (id.includes('src/stories')) return 'platform-stories';

  // Everything the shell needs on every page
  if (id.includes('src/components/') || id.includes('src/data/') || id.includes('src/context/') || id.includes('src/lib/')) return 'app-shared';

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
  return undefined;
};

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Rolldown's default splitting already gives each lazily-imported section its
      // own chunk. Hand-written manualChunks kept sweeping shared modules into
      // section chunks, which made the entry statically depend on them — the
      // records/charts bundle was being preloaded on every page.
      output: {},
    },
  },
  server: {
    port: 5173,
  },
});
