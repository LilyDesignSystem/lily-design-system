import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PortugalPassaporteInput component -->\n<!--\n  Description: an input for entering Portugal's Passaporte\n  HTML tag: <input>\n  CSS class: portugal-passaporte-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 1 letter [A-Z] and 6 digits [0-9]\n  Usage:\n    <input class=\"portugal-passaporte-input\" type=\"text\" aria-label=\"Portuguese Passport\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"portugal-passaporte-input\"\n  type=\"text\"\n  aria-label=\"Portuguese Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Portugal Passaporte Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
