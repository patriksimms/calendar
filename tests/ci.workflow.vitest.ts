import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const workflowPath = path.join(root, '.github', 'workflows', 'ci.yml');

describe('GitHub Actions CI workflow', () => {
    it('exists at .github/workflows/ci.yml', () => {
        expect(existsSync(workflowPath)).toBe(true);
    });

    const yml = existsSync(workflowPath) ? readFileSync(workflowPath, 'utf8') : '';

    it('runs the install/lint/typecheck/test/build/pack pipeline', () => {
        expect(yml).toMatch(/bun install/);
        expect(yml).toMatch(/bun\s+run\s+lint/);
        expect(yml).toMatch(/bun\s+run\s+typecheck/);
        expect(yml).toMatch(/bun\s+run\s+test/);
        expect(yml).toMatch(/bun\s+run\s+build/);
        expect(yml).toMatch(/bun\s+pm\s+pack\s+--dry-run/);
    });

    it('uses Bun with a Node version compatible with TypeScript configs', () => {
        expect(yml).toMatch(/actions\/setup-node@v4/);
        expect(yml).toMatch(/node-version:\s*['"]22['"]/);
        expect(yml).toMatch(/oven-sh\/setup-bun@v2/);
    });

    it('triggers on push and pull_request', () => {
        expect(yml).toMatch(/on:\s*\n[\s\S]*push:/);
        expect(yml).toMatch(/pull_request:/);
    });
});
