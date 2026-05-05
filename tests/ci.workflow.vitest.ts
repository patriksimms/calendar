import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const workflowPath = path.join(root, '.github', 'workflows', 'ci.yml');
const pagesWorkflowPath = path.join(root, '.github', 'workflows', 'pages.yml');

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

describe('GitHub Actions Pages workflow', () => {
    it('deploys the examples app with current repository deployment metadata', () => {
        const yml = readFileSync(pagesWorkflowPath, 'utf8');

        expect(yml).toMatch(/oven-sh\/setup-bun@v2/);
        expect(yml).toMatch(/working-directory:\s*examples/);
        expect(yml).toMatch(/VITE_BASE:\s*\/\$\{\{\s*github\.event\.repository\.name\s*\}\}\//);
        expect(yml).toMatch(/VITE_PACKAGE_VERSION/);
        expect(yml).toMatch(/VITE_REPOSITORY:\s*\$\{\{\s*github\.repository\s*\}\}/);
        expect(yml).toMatch(/VITE_REF_NAME:\s*\$\{\{\s*github\.ref_name\s*\}\}/);
        expect(yml).toMatch(/VITE_SHORT_SHA/);
        expect(yml).toMatch(/path:\s*examples\/dist/);
        expect(yml).toMatch(/actions\/deploy-pages@v4/);
    });
});
