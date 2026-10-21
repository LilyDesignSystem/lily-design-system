import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MagyarorszagTajSzamInput component -->\n<!--\n  Description: an input for entering Hungary's Tarsadalombiztositasi Azonosito Jel (TAJ)\n  HTML tag: <input>\n  CSS class: magyarorszag-taj-szam-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Nine digits, SSS SSS SSK. The ninth digit is a check digit from alternating weights 3 and 7 over the first eight, Modulus 10.\n  Usage:\n    <input class=\"magyarorszag-taj-szam-input\" type=\"text\" aria-label=\"Társadalombiztosítási Azonosító Jel (TAJ)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"magyarorszag-taj-szam-input\"\n  type=\"text\"\n  aria-label=\"Társadalombiztosítási Azonosító Jel (TAJ)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Magyarorszag Taj Szam Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
