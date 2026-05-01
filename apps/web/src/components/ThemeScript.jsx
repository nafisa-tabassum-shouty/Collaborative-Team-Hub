// This script is injected directly into <head> BEFORE React hydrates.
// It prevents a flash of wrong theme (FOUT) on page load.
// It reads localStorage and applies the dark class synchronously.
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = stored === 'dark' || ((!stored || stored === 'system') && prefersDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
`;

export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
