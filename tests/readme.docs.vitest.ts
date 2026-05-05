import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const readme = readFileSync(path.join(root, 'README.md'), 'utf8');

describe('README documentation', () => {
    it('describes the modern tsdown + vite + vitest + oxlint toolchain', () => {
        expect(readme).toMatch(/tsdown/i);
        expect(readme).toMatch(/vite/i);
        expect(readme).toMatch(/vitest/i);
        expect(readme).toMatch(/oxlint/i);
    });

    it('documents installing styles via the assets entry', () => {
        expect(readme).toMatch(/@patriksimms\/calendar\/assets\/index\.(less|css)/);
    });

    it('explains that this fork targets modern React usage', () => {
        expect(readme).toMatch(/fork exists/i);
        expect(readme).toMatch(/modern React applications/i);
        expect(readme).toMatch(/React 19/);
    });

    it('documents the demo workflow under examples/', () => {
        expect(readme).toMatch(/examples/i);
        expect(readme).toMatch(/bun\s+run\s+dev/);
    });

    it('documents the testing approach', () => {
        expect(readme).toMatch(/bun\s+run\s+test/);
        expect(readme).toMatch(/@testing-library\/react|React Testing Library/i);
    });

    it('claims modern evergreen browser support, not IE', () => {
        expect(readme).not.toMatch(/\bIE\s*9\b/i);
        expect(readme).not.toMatch(/\bie9\b/i);
        expect(readme).toMatch(/evergreen|Chrome|Firefox|Safari|Edge/i);
    });

    it('avoids release/version-bump wording in development docs', () => {
        const devSection = readme.split(/##\s+Development/i)[1] ?? '';
        expect(devSection).not.toMatch(/\brelease\b/i);
        expect(devSection).not.toMatch(/version\s*bump/i);
        expect(devSection).not.toMatch(/CHANGELOG/i);
    });
});
