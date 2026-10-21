import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CheckboxInput component -->\n<!--\n  Description: a checkbox input for toggling a boolean value\n  HTML tag: <input>\n  CSS class: checkbox-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"checkbox-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"checkbox-input\"\n  type=\"checkbox\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Checkbox Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
