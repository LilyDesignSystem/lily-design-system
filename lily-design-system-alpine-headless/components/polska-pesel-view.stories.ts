import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PolskaPeselView component -->\n<!--\n  Description: a read-only display of Poland's PESEL\n  HTML tag: <span>\n  CSS class: polska-pesel-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 numeric digits; assigned shortly after birth and unchanged for life\n  Usage:\n    <span class=\"polska-pesel-view\" aria-label=\"PESEL\">value-here</span>\n-->\n\n<span\n  class=\"polska-pesel-view\"\n  aria-label=\"PESEL\"\n></span>";

const meta = {
  title: 'Headless/Polska Pesel View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
