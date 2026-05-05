import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const examplesDir = path.join(root, 'examples');

describe('examples app', () => {
    it('has its own package.json declaring vite and react 19', () => {
        const pkgPath = path.join(examplesDir, 'package.json');
        expect(existsSync(pkgPath)).toBe(true);

        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };

        expect(deps).toHaveProperty('vite');
        expect(deps.react).toMatch(/19/);
        expect(deps['react-dom']).toMatch(/19/);

        expect(pkg.scripts?.dev).toMatch(/vite/);
        expect(pkg.scripts?.build).toMatch(/vite\s+build/);
    });

    it('ships a Vite config', () => {
        const candidates = ['vite.config.ts', 'vite.config.js', 'vite.config.mts'];
        const found = candidates.some((file) => existsSync(path.join(examplesDir, file)));
        expect(found).toBe(true);
    });

    it('ships an index.html that mounts the React entry', () => {
        const html = readFileSync(path.join(examplesDir, 'index.html'), 'utf8');
        expect(html).toMatch(/<div\s+id=["']root["']/);
        expect(html).toMatch(/src=["'][^"']*main\.tsx["']/);
    });

    it('boots the entry with the modern React root API', () => {
        const main = readFileSync(path.join(examplesDir, 'src', 'main.tsx'), 'utf8');
        expect(main).toMatch(/from\s+['"]react-dom\/client['"]/);
        expect(main).toMatch(/createRoot\(/);
        expect(main).not.toMatch(/ReactDOM\.render\(/);
    });

    it('does not retain legacy ReactDOM.render bootstraps in any example', () => {
        const offenders: string[] = [];
        for (const file of readdirSync(examplesDir, { recursive: true }) as string[]) {
            if (typeof file !== 'string') continue;
            if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;
            if (file.startsWith('node_modules')) continue;
            const full = path.join(examplesDir, file);
            const text = readFileSync(full, 'utf8');
            if (/ReactDOM\.render\(/.test(text)) offenders.push(file);
        }
        expect(offenders).toEqual([]);
    });

    it('covers each legacy demo scenario', () => {
        const demosDir = path.join(examplesDir, 'src', 'demos');
        const names = readdirSync(demosDir).filter((file) => file.endsWith('.tsx'));

        const expected = [
            'Basic.tsx',
            'RangeCalendar.tsx',
            'WeekCalendar.tsx',
            'MonthCalendar.tsx',
            'FullCalendar.tsx',
            'CustomClearIcon.tsx',
            'Container.tsx',
            'ControlPanel.tsx',
            'StartEnd.tsx',
            'StartEndRange.tsx',
        ];
        expect(expected.filter((file) => !names.includes(file))).toEqual([]);
    });

    it('keeps legacy Pages example URLs as redirects into the Vite app', () => {
        const redirects: Record<string, string> = {
            'antd-calendar.html': '#/basic',
            'antd-month-calendar.html': '#/month',
            'antd-range-calendar.html': '#/range',
            'control-panel.html': '#/control-panel',
            'custom-clear-icon.html': '#/custom-clear-icon',
            'full-calendar.html': '#/full',
            'getCalendarContainer.html': '#/container',
            'start-end.html': '#/start-end',
            'start-end-range.html': '#/start-end-range',
            'week.html': '#/week',
        };

        for (const [file, hash] of Object.entries(redirects)) {
            const html = readFileSync(path.join(examplesDir, 'public', file), 'utf8');
            expect(html).toContain(hash);
        }
    });

    it('renders Pages deployment information from Vite environment values', () => {
        const app = readFileSync(path.join(examplesDir, 'src', 'App.tsx'), 'utf8');

        expect(app).toMatch(/Pages deployment information/);
        expect(app).toMatch(/VITE_PACKAGE_VERSION/);
        expect(app).toMatch(/VITE_REPOSITORY/);
        expect(app).toMatch(/VITE_REF_NAME/);
        expect(app).toMatch(/VITE_SHORT_SHA/);
        expect(app).toMatch(/BASE_URL/);
    });

    it('strips rc-menu legacy browser require from the production bundle', () => {
        const viteConfig = readFileSync(path.join(examplesDir, 'vite.config.ts'), 'utf8');

        expect(viteConfig).toMatch(/stripLegacyMutationObserverRequire/);
        expect(viteConfig).toMatch(/mutationobserver-shim/);
    });

    it('imports the calendar package through workspace source paths', () => {
        const basic = readFileSync(path.join(examplesDir, 'src', 'demos', 'Basic.tsx'), 'utf8');
        expect(basic).toMatch(/from\s+['"][^'"]*src\/Calendar['"]/);
    });
});
