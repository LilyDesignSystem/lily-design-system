import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PolskaPeselInput component -->\n<!--\n  Description: an input for entering Poland's PESEL\n  HTML tag: <input>\n  CSS class: polska-pesel-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 numeric digits; assigned shortly after birth and unchanged for life\n  Usage:\n    <input class=\"polska-pesel-input\" type=\"text\" aria-label=\"PESEL\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"polska-pesel-input\"\n  type=\"text\"\n  aria-label=\"PESEL\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Polska Pesel Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
