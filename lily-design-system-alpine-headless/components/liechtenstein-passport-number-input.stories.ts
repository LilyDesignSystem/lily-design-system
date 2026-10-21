import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LiechtensteinPassportNumberInput component -->\n<!--\n  Description: an input for entering Liechtenstein's Liechtenstein Passport Number\n  HTML tag: <input>\n  CSS class: liechtenstein-passport-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 1 letter followed by 5 digits (e.g. R00536)\n  Usage:\n    <input class=\"liechtenstein-passport-number-input\" type=\"text\" aria-label=\"Liechtenstein Passport Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"liechtenstein-passport-number-input\"\n  type=\"text\"\n  aria-label=\"Liechtenstein Passport Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Liechtenstein Passport Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
