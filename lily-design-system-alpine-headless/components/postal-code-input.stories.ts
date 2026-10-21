import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PostalCodeInput component -->\n<!--\n  Description: an input for entering a postal or ZIP code\n  HTML tag: <input>\n  CSS class: postal-code-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"postal-code-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"postal-code-input\"\n  type=\"text\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Postal Code Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
