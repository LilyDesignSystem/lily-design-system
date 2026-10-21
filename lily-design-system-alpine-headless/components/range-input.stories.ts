import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RangeInput component -->\n<!--\n  Description: a slider input for selecting a value within a range\n  HTML tag: <input>\n  CSS class: range-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"range-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"range-input\"\n  type=\"range\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Range Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
