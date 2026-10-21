import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LietuvaPasasView component -->\n<!--\n  Description: a read-only display of Lithuania's Pasas\n  HTML tag: <span>\n  CSS class: lietuva-pasas-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 8-digit passport or identity card number\n  Usage:\n    <span class=\"lietuva-pasas-view\" aria-label=\"Lithuanian Passport\">value-here</span>\n-->\n\n<span\n  class=\"lietuva-pasas-view\"\n  aria-label=\"Lithuanian Passport\"\n></span>";

const meta = {
  title: 'Headless/Lietuva Pasas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
