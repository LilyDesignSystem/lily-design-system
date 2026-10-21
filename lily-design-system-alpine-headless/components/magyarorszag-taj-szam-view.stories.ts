import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MagyarorszagTajSzamView component -->\n<!--\n  Description: a read-only display of Hungary's Tarsadalombiztositasi Azonosito Jel (TAJ)\n  HTML tag: <span>\n  CSS class: magyarorszag-taj-szam-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Nine digits, SSS SSS SSK. The ninth digit is a check digit from alternating weights 3 and 7 over the first eight, Modulus 10.\n  Usage:\n    <span class=\"magyarorszag-taj-szam-view\" aria-label=\"Társadalombiztosítási Azonosító Jel (TAJ)\">value-here</span>\n-->\n\n<span\n  class=\"magyarorszag-taj-szam-view\"\n  aria-label=\"Társadalombiztosítási Azonosító Jel (TAJ)\"\n></span>";

const meta = {
  title: 'Headless/Magyarorszag Taj Szam View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
