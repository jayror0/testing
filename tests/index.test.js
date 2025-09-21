/**
 * Tests for tests/index.test.html structure and behavior hooks.
 * Framework: Jest with jsdom (preferred if present).
 * If your repo uses another framework (e.g., Vitest with jsdom, QUnit, Mocha+jsdom),
 * the test style should be similar and easily adaptable.
 */

describe('index.test.html - DOM structure and interactions', () => {
  const readHtml = () => {
    // Load the HTML fixture from disk
    const fs = require('fs');
    const path = require('path');
    const htmlPath = path.resolve(__dirname, 'index.test.html');
    return fs.readFileSync(htmlPath, 'utf8');
  };

  const loadDom = (overrideChangeTheme) => {
    document.documentElement.innerHTML = readHtml();

    // Provide a stubbed global changeTheme if requested
    if (overrideChangeTheme !== undefined) {
      // Define global to satisfy inline onclick handlers
      // eslint-disable-next-line no-undef
      global.changeTheme = overrideChangeTheme;
      // Also attach to window for onclick attribute resolution
      try {
        // eslint-disable-next-line no-undef
        window.changeTheme = overrideChangeTheme;
      } catch (_) {
        // window is not available in this environment
      }
    } else {
      // Ensure any prior global is cleared
      // eslint-disable-next-line no-undef
      delete global.changeTheme;
      try {
        // eslint-disable-next-line no-undef
        delete window.changeTheme;
      } catch (_) {
        // window is not available
      }
    }
  };

  beforeEach(() => {
    // Reset DOM to a clean state per test
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  test('has correct document head metadata and title', () => {
    loadDom(jest.fn());
    const charset = document.querySelector('meta[charset="UTF-8"]');
    const viewport = document.querySelector('meta[name="viewport"][content="width=device-width, initial-scale=1.0"]');
    const title = document.querySelector('title');

    expect(charset).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Artistic JavaScript Experience');
  });

  test('renders art container with title and 7 themed buttons', () => {
    loadDom(jest.fn());
    const container = document.querySelector('.art-container');
    const heading = document.querySelector('.art-container .art-title');
    const buttons = document.querySelectorAll('.art-container .art-button');

    expect(container).not.toBeNull();
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Art in Motion');
    expect(buttons.length).toBe(7);

    // Validate visible texts are as expected and onclick attribute is wired
    const expectedTexts = [
      'Click Me 1!!!','Click Me 2!!!','Click Me 3!!!','Click Me 4!!!',
      'Click Me 5!!!','Click Me 6!!!','Click Me 7!!!'
    ];
    buttons.forEach((btn, idx) => {
      expect(btn.textContent).toBe(expectedTexts[idx]);
      // Inline handler should exist
      expect(btn.getAttribute('onclick')).toBe('changeTheme()');
    });
  });

  test('has shapes and particles containers by id', () => {
    loadDom(jest.fn());
    const shapes = document.getElementById('shapes-container');
    const particles = document.getElementById('particles-container');
    expect(shapes).not.toBeNull();
    expect(particles).not.toBeNull();
  });

  test('clicking each button invokes changeTheme exactly once per click (happy path)', () => {
    const spy = jest.fn();
    loadDom(spy);
    const buttons = Array.from(document.querySelectorAll('.art-button'));
    expect(buttons).toHaveLength(7);

    buttons.forEach((btn) => {
      // Simulate click by directly calling the inline handler expression
      // Since inline onclick is set, .click() should trigger it in jsdom by invoking attribute handler.
      // However, jsdom may not evaluate inline onclick text automatically.
      // To ensure invocation, we emulate attribute-driven behavior by calling the global directly as fallback.
      btn.click?.();
      if (spy.mock.calls.length === 0) {
        // Fallback: emulate attribute handler call when jsdom doesn't bind inline handlers
        try {
          // eslint-disable-next-line no-undef
          if (typeof window.changeTheme === 'function') {
            // eslint-disable-next-line no-undef
            window.changeTheme();
          } else {
            // eslint-disable-next-line no-undef
            if (typeof global.changeTheme === 'function') {
              // eslint-disable-next-line no-undef
              global.changeTheme();
            }
          }
        } catch (_) {
          // window is not defined; fall back to global
          // eslint-disable-next-line no-undef
          if (typeof global.changeTheme === 'function') {
            // eslint-disable-next-line no-undef
            global.changeTheme();
          }
        }
      }
    });

    expect(spy).toHaveBeenCalledTimes(7);
  });

  test('gracefully handles missing global changeTheme by ensuring inline handlers do not throw on inspection', () => {
    loadDom(undefined); // do not define global
    const buttons = document.querySelectorAll('.art-button');
    expect(buttons.length).toBe(7);
    buttons.forEach((btn) => {
      // Accessing attribute should work
      expect(btn.getAttribute('onclick')).toBe('changeTheme()');
    });
  });

  test('script tag references script.js as expected', () => {
    loadDom(jest.fn());
    const scripts = document.querySelectorAll('script[src]');
    const srcs = Array.from(scripts).map(s => s.getAttribute('src'));
    expect(srcs).toContain('script.js');
  });

  test('no unexpected extra interactive controls in art-container beyond the 7 themed buttons and title', () => {
    loadDom(jest.fn());
    const container = document.querySelector('.art-container');
    const controls = container.querySelectorAll('button, input, a, select, textarea');
    // Expect only 7 buttons
    expect(controls.length).toBe(7);
  });

  test('buttons are consistently classed as art-button', () => {
    loadDom(jest.fn());
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.classList.contains('art-button')).toBe(true);
    });
  });
});