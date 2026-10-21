import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SchweizAhvNummerView component -->\n<!--\n  Description: a read-only display of Switzerland's AHV-Nummer / Numéro AVS\n  HTML tag: <span>\n  CSS class: schweiz-ahv-nummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.\n  Usage:\n    <span class=\"schweiz-ahv-nummer-view\" aria-label=\"AHV-Nummer / Numéro AVS\">value-here</span>\n-->\n\n<span\n  class=\"schweiz-ahv-nummer-view\"\n  aria-label=\"AHV-Nummer / Numéro AVS\"\n></span>";

const meta = {
  title: 'Headless/Schweiz Ahv Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
