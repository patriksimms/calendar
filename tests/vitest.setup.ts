import '@testing-library/jest-dom/vitest';
import '../src/util/findDOMNodePolyfill';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
    cleanup();
});
