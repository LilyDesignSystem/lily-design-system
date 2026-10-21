import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SuomiHenkilotunnusInput component -->\n<!--\n  Description: an input for entering Finland's Henkilötunnus (HETU)\n  HTML tag: <input>\n  CSS class: suomi-henkilotunnus-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum\n  Usage:\n    <input class=\"suomi-henkilotunnus-input\" type=\"text\" aria-label=\"Personal Identity Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"suomi-henkilotunnus-input\"\n  type=\"text\"\n  aria-label=\"Personal Identity Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Suomi Henkilotunnus Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
