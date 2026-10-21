import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AotearoaNationalHealthIndexView component -->\n<!--\n  Description: a read-only display of New Zealand's National Health Index (NHI) Number\n  HTML tag: <span>\n  CSS class: aotearoa-national-health-index-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.\n  Usage:\n    <span class=\"aotearoa-national-health-index-view\" aria-label=\"National Health Index (NHI) Number\">value-here</span>\n-->\n\n<span\n  class=\"aotearoa-national-health-index-view\"\n  aria-label=\"National Health Index (NHI) Number\"\n></span>";

const meta = {
  title: 'Headless/Aotearoa National Health Index View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
