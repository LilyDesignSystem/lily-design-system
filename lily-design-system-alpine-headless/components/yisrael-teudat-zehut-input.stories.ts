import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- YisraelTeudatZehutInput component -->\n<!--\n  Description: an input for entering Israel's Teudat Zehut (תעודת זהות)\n  HTML tag: <input>\n  CSS class: yisrael-teudat-zehut-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.\n  Usage:\n    <input class=\"yisrael-teudat-zehut-input\" type=\"text\" aria-label=\"Teudat Zehut (תעודת זהות)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"yisrael-teudat-zehut-input\"\n  type=\"text\"\n  aria-label=\"Teudat Zehut (תעודת זהות)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Yisrael Teudat Zehut Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
