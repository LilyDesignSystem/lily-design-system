import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- IslandKennitalaInput component -->\n<!--\n  Description: an input for entering Iceland's Kennitala\n  HTML tag: <input>\n  CSS class: island-kennitala-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits where the first 6 are the date of birth (DDMMYY)\n  Usage:\n    <input class=\"island-kennitala-input\" type=\"text\" aria-label=\"Personal Identity Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"island-kennitala-input\"\n  type=\"text\"\n  aria-label=\"Personal Identity Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Island Kennitala Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
