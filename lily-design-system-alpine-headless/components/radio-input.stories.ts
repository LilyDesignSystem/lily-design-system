import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RadioInput component -->\n<!--\n  Description: a single radio button input\n  HTML tag: <input>\n  CSS class: radio-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"radio-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"radio-input\"\n  type=\"radio\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Radio Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
