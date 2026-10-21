import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PortugalPassaporteView component -->\n<!--\n  Description: a read-only display of Portugal's Passaporte\n  HTML tag: <span>\n  CSS class: portugal-passaporte-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 1 letter [A-Z] and 6 digits [0-9]\n  Usage:\n    <span class=\"portugal-passaporte-view\" aria-label=\"Portuguese Passport\">value-here</span>\n-->\n\n<span\n  class=\"portugal-passaporte-view\"\n  aria-label=\"Portuguese Passport\"\n></span>";

const meta = {
  title: 'Headless/Portugal Passaporte View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
