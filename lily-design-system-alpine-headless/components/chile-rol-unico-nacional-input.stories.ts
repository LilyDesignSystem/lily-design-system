import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ChileRolUnicoNacionalInput component -->\n<!--\n  Description: an input for entering Chile's Rol Unico Nacional (RUN)\n  HTML tag: <input>\n  CSS class: chile-rol-unico-nacional-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).\n  Usage:\n    <input class=\"chile-rol-unico-nacional-input\" type=\"text\" aria-label=\"Rol Único Nacional (RUN)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"chile-rol-unico-nacional-input\"\n  type=\"text\"\n  aria-label=\"Rol Único Nacional (RUN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Chile Rol Unico Nacional Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
