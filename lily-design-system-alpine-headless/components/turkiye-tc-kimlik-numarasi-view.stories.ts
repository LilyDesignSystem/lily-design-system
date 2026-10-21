import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TurkiyeTcKimlikNumarasiView component -->\n<!--\n  Description: a read-only display of Turkey's T.C. Kimlik Numarasi\n  HTML tag: <span>\n  CSS class: turkiye-tc-kimlik-numarasi-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Eleven digits; digits 10-11 are computed check digits, the last always even.\n  Usage:\n    <span class=\"turkiye-tc-kimlik-numarasi-view\" aria-label=\"T.C. Kimlik Numarası\">value-here</span>\n-->\n\n<span\n  class=\"turkiye-tc-kimlik-numarasi-view\"\n  aria-label=\"T.C. Kimlik Numarası\"\n></span>";

const meta = {
  title: 'Headless/Turkiye Tc Kimlik Numarasi View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
