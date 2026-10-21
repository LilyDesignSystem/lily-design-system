import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SubmitInput component -->\n<!--\n  Description: a button input that submits a form\n  HTML tag: <input>\n  CSS class: submit-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"submit-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"submit-input\"\n  type=\"submit\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Submit Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
