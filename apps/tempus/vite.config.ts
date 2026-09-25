import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Tempus',
        short_name: 'Tempus',
        description: '時間割型のタスク管理',
        theme_color: '#0b0f14',
        background_color: '#0b0f14',
        display: 'standalone',
        start_url: '/',
        // ホーム画面から1タップで起票できるようにする（起票コストを潰す要件）
        shortcuts: [
          { name: 'タスクを追加', short_name: '追加', url: '/?capture=1' },
          { name: '今日の時間割', short_name: '今日', url: '/?view=today' },
        ],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 圏外では「見る＋起票」だけできればよい。編集・完了はオンライン時のみ。
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/rest/v1/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tempus-api',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 3 },
            },
          },
        ],
      },
    }),
  ],
  // supabase/verify/*.test.mjs は vitest ではなく node で直接動かす検証（npm run verify:db）。
  // ここで拾わせないよう対象を src に限定する。
  test: { environment: 'node', globals: true, include: ['src/**/*.test.ts'] },
});
