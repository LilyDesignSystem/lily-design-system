import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RomaniaPasaportView component -->\n<!--\n  Description: a read-only display of Romania's Paşaport\n  HTML tag: <span>\n  CSS class: romania-pasaport-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]\n  Usage:\n    <span class=\"romania-pasaport-view\" aria-label=\"Romanian Passport\">value-here</span>\n-->\n\n<span\n  class=\"romania-pasaport-view\"\n  aria-label=\"Romanian Passport\"\n></span>";

const meta = {
  title: 'Headless/Romania Pasaport View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
