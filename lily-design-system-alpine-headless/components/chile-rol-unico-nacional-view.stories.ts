import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ChileRolUnicoNacionalView component -->\n<!--\n  Description: a read-only display of Chile's Rol Unico Nacional (RUN)\n  HTML tag: <span>\n  CSS class: chile-rol-unico-nacional-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).\n  Usage:\n    <span class=\"chile-rol-unico-nacional-view\" aria-label=\"Rol Único Nacional (RUN)\">value-here</span>\n-->\n\n<span\n  class=\"chile-rol-unico-nacional-view\"\n  aria-label=\"Rol Único Nacional (RUN)\"\n></span>";

const meta = {
  title: 'Headless/Chile Rol Unico Nacional View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
