import { execFileSync, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const libDir = path.join(root, 'lib');
const esDir = path.join(root, 'es');
const assetsDir = path.join(root, 'assets');

function ensureBuilt(): void {
    if (existsSync(path.join(libDir, 'index.js')) && existsSync(path.join(esDir, 'index.js'))) {
        return;
    }
    execSync('bun run build', { cwd: root, stdio: 'inherit' });
}

function nodeRequire(absPath: string): string {
    const expr =
        'const m = require(' +
        JSON.stringify(absPath) +
        '); const v = (m && m.default) ? m.default : m; ' +
        'process.stdout.write(typeof v + ":" + (v && (v.displayName || v.name) || ""));';
    return execFileSync('node', ['-e', expr]).toString();
}

const documentedDeepEntries = ['RangeCalendar', 'MonthCalendar', 'Picker', 'FullCalendar'] as const;

const documentedLocales = ['en_US', 'zh_CN', 'de_DE', 'fr_FR', 'ja_JP'] as const;

describe('package smoke', () => {
    beforeAll(() => {
        ensureBuilt();
    }, 180_000);

    it('publishes CJS lib/index.js with a Calendar default export', () => {
        const out = nodeRequire(path.join(libDir, 'index.js'));
        expect(out.startsWith('function')).toBe(true);
    });

    it('publishes ESM es/index.js using ESM syntax', () => {
        const file = path.join(esDir, 'index.js');
        expect(existsSync(file)).toBe(true);
        const content = readFileSync(file, 'utf8');
        expect(content).toMatch(/\bexport\s+(default|\{)/);
        expect(content).not.toMatch(/module\.exports\s*=/);
    });

    it.each(documentedDeepEntries)(
        'exposes documented deep import lib/%s.js (CJS)',
        (name) => {
            const out = nodeRequire(path.join(libDir, `${name}.js`));
            expect(out.startsWith('function')).toBe(true);
        },
    );

    it.each(documentedDeepEntries)('exposes documented deep import es/%s.js (ESM)', (name) => {
        const file = path.join(esDir, `${name}.js`);
        expect(existsSync(file)).toBe(true);
        const content = readFileSync(file, 'utf8');
        expect(content).toMatch(/\bexport\s+(default|\{)/);
    });

    it.each(documentedLocales)('publishes locale lib/locale/%s.js (CJS)', (name) => {
        const file = path.join(libDir, 'locale', `${name}.js`);
        expect(existsSync(file)).toBe(true);
        const out = nodeRequire(file);
        expect(out.startsWith('object')).toBe(true);
    });

    it.each(documentedLocales)('publishes locale es/locale/%s.js (ESM)', (name) => {
        const file = path.join(esDir, 'locale', `${name}.js`);
        expect(existsSync(file)).toBe(true);
        const content = readFileSync(file, 'utf8');
        expect(content).toMatch(/\bexport\s+(default\b|\{[^}]*\bas\s+default\b)/);
        expect(content).not.toMatch(/module\.exports\s*=/);
    });

    it('keeps less sources as standalone package assets', () => {
        const expected = [
            'index.less',
            'common/Calendar.less',
            'common/FullCalendar.less',
            'common/Picker.less',
            'common/RangeCalendar.less',
            'common/index.less',
            'index/Calendar.less',
            'index/Picker.less',
        ];
        for (const rel of expected) {
            expect(existsSync(path.join(assetsDir, rel))).toBe(true);
        }
    });

    it('emits a compiled stylesheet at assets/index.css', () => {
        const file = path.join(assetsDir, 'index.css');
        expect(existsSync(file)).toBe(true);
        const css = readFileSync(file, 'utf8');
        expect(css).toContain('.rc-calendar');
    });

    it('exposes a public type entrypoint at index.d.ts', () => {
        const file = path.join(root, 'index.d.ts');
        const content = readFileSync(file, 'utf8');
        expect(content).toMatch(/export\s+default\s+class\s+ReactCalendar/);
        expect(content).toMatch(/export\s+interface\s+Props/);
    });

    it('declares a published manifest free of legacy rc-tools/babel build tooling', () => {
        const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

        expect(pkg.name).toBe('@patriksimms/calendar');
        expect(pkg.main).toBe('lib/index');
        expect(pkg.module).toBe('es/index');
        expect(pkg.types).toBe('index.d.ts');
        expect(pkg.publishConfig?.access).toBe('public');

        const files: string[] = pkg.files ?? [];
        expect(files).toContain('lib');
        expect(files).toContain('es');
        expect(files).toContain('index.d.ts');
        expect(files.some((entry) => entry.startsWith('assets'))).toBe(true);

        const allDeps = {
            ...(pkg.dependencies ?? {}),
            ...(pkg.devDependencies ?? {}),
        };
        expect(allDeps).not.toHaveProperty('rc-tools');
        expect(allDeps).not.toHaveProperty('babel-runtime');

        expect(JSON.stringify(pkg.scripts ?? {})).not.toMatch(/rc-tools/);
    });

    it('declares React 19 compatibility via peerDependencies', () => {
        const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
        const peers = pkg.peerDependencies ?? {};
        expect(peers.react).toBeDefined();
        expect(peers['react-dom']).toBeDefined();
        expect(peers.react).toMatch(/19/);
        expect(peers['react-dom']).toMatch(/19/);
    });
});
