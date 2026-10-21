import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SchweizAhvNummerInput component -->\n<!--\n  Description: an input for entering Switzerland's AHV-Nummer / Numéro AVS\n  HTML tag: <input>\n  CSS class: schweiz-ahv-nummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.\n  Usage:\n    <input class=\"schweiz-ahv-nummer-input\" type=\"text\" aria-label=\"AHV-Nummer / Numéro AVS\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"schweiz-ahv-nummer-input\"\n  type=\"text\"\n  aria-label=\"AHV-Nummer / Numéro AVS\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Schweiz Ahv Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
