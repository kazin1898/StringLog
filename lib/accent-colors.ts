export interface AccentPreset {
  id: string;
  label: string;
  light: string;
  dark: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'violet', label: 'Violet', light: 'oklch(0.627 0.265 303.9)', dark: 'oklch(0.627 0.265 303.9)' },
  { id: 'blue', label: 'Blue', light: 'oklch(0.546 0.245 262.881)', dark: 'oklch(0.623 0.214 259.815)' },
  { id: 'teal', label: 'Teal', light: 'oklch(0.555 0.163 180.956)', dark: 'oklch(0.696 0.17 162.48)' },
  { id: 'green', label: 'Green', light: 'oklch(0.545 0.175 149.214)', dark: 'oklch(0.648 0.2 145.737)' },
  { id: 'amber', label: 'Amber', light: 'oklch(0.705 0.183 74.439)', dark: 'oklch(0.828 0.189 84.429)' },
  { id: 'rose', label: 'Rose', light: 'oklch(0.585 0.22 17.117)', dark: 'oklch(0.645 0.246 16.439)' },
];

export const DEFAULT_ACCENT = 'violet';

export function applyAccent(presetId: string) {
  const preset = ACCENT_PRESETS.find(p => p.id === presetId) ?? ACCENT_PRESETS[0];
  const style = document.documentElement.style;
  style.setProperty('--sl-accent-light', preset.light);
  style.setProperty('--sl-accent-dark', preset.dark);
}
