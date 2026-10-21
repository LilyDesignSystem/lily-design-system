import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LietuvaPasasInput component -->\n<!--\n  Description: an input for entering Lithuania's Pasas\n  HTML tag: <input>\n  CSS class: lietuva-pasas-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 8-digit passport or identity card number\n  Usage:\n    <input class=\"lietuva-pasas-input\" type=\"text\" aria-label=\"Lithuanian Passport\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"lietuva-pasas-input\"\n  type=\"text\"\n  aria-label=\"Lithuanian Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Lietuva Pasas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
