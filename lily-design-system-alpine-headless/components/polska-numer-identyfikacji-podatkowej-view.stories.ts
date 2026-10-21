import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PolskaNumerIdentyfikacjiPodatkowejView component -->\n<!--\n  Description: a read-only display of Poland's Numer Identyfikacji Podatkowej (NIP)\n  HTML tag: <span>\n  CSS class: polska-numer-identyfikacji-podatkowej-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 numeric digits used for tax identification\n  Usage:\n    <span class=\"polska-numer-identyfikacji-podatkowej-view\" aria-label=\"Tax Identification Number\">value-here</span>\n-->\n\n<span\n  class=\"polska-numer-identyfikacji-podatkowej-view\"\n  aria-label=\"Tax Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Polska Numer Identyfikacji Podatkowej View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
