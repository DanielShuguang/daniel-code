import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/*'],
      environment: 'jsdom'
    }
  })
)
