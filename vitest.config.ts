import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'miniflare',
    environmentOptions: {
      kvNamespaces: ['TRENDING_KV'],
      bindings: {
        GITHUB_TOKEN: 'test-token'
      }
    }
  }
});