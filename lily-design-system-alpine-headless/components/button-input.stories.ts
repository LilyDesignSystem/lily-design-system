import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ButtonInput component -->\n<!--\n  Description: an input element of type button for form actions\n  HTML tag: <input>\n  CSS class: button-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"button-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"button-input\"\n  type=\"button\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Button Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
