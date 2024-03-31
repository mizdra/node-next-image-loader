import GithubActionsReporter from 'vitest-github-actions-reporter';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    // biome-ignore lint/complexity/useLiteralKeys: for compatibility with tsc
    reporters: process.env['GITHUB_ACTIONS'] ? ['default', new GithubActionsReporter()] : 'default',
    cache: {
      dir: 'node_modules/.cache/vitest',
    },
  },
});
