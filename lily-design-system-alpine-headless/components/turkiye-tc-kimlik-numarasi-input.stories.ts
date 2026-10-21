import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TurkiyeTcKimlikNumarasiInput component -->\n<!--\n  Description: an input for entering Turkey's T.C. Kimlik Numarasi\n  HTML tag: <input>\n  CSS class: turkiye-tc-kimlik-numarasi-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Eleven digits; digits 10-11 are computed check digits, the last always even.\n  Usage:\n    <input class=\"turkiye-tc-kimlik-numarasi-input\" type=\"text\" aria-label=\"T.C. Kimlik Numarası\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"turkiye-tc-kimlik-numarasi-input\"\n  type=\"text\"\n  aria-label=\"T.C. Kimlik Numarası\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Turkiye Tc Kimlik Numarasi Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
