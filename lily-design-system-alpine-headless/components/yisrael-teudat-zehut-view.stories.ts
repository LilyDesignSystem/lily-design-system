import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- YisraelTeudatZehutView component -->\n<!--\n  Description: a read-only display of Israel's Teudat Zehut (תעודת זהות)\n  HTML tag: <span>\n  CSS class: yisrael-teudat-zehut-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.\n  Usage:\n    <span class=\"yisrael-teudat-zehut-view\" aria-label=\"Teudat Zehut (תעודת זהות)\">value-here</span>\n-->\n\n<span\n  class=\"yisrael-teudat-zehut-view\"\n  aria-label=\"Teudat Zehut (תעודת זהות)\"\n></span>";

const meta = {
  title: 'Headless/Yisrael Teudat Zehut View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
