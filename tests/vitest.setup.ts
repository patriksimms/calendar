import '@testing-library/jest-dom/vitest';
import '../src/util/findDOMNodePolyfill';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

class ResizeObserverMock implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = ResizeObserverMock;
}

afterEach(() => {
    cleanup();
});
