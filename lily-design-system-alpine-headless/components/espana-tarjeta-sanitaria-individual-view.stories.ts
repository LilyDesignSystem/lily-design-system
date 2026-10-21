import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EspanaTarjetaSanitariaIndividualView component -->\n<!--\n  Description: a read-only display of a España TSI unique national healthcare identifier\n  HTML tag: <span>\n  CSS class: espana-tarjeta-sanitaria-individual-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"espana-tarjeta-sanitaria-individual-view\" aria-label=\"TSI\">BBBB12345678</span>\n-->\n\n<span\n  class=\"espana-tarjeta-sanitaria-individual-view\"\n  aria-label=\"TSI\"\n></span>";

const meta = {
  title: 'Headless/Espana Tarjeta Sanitaria Individual View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
