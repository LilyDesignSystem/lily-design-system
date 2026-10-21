import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NumberInput component -->\n<!--\n  Description: an input for entering a numeric value with validation\n  HTML tag: <input>\n  CSS class: number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"number-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"number-input\"\n  type=\"number\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
