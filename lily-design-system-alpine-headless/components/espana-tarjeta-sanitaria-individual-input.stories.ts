import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EspanaTarjetaSanitariaIndividualInput component -->\n<!--\n  Description: an input for entering a España TSI unique national healthcare identifier\n  HTML tag: <input>\n  CSS class: espana-tarjeta-sanitaria-individual-input\n  Keyboard: Standard text input\n  Accessibility: aria-label, autocomplete=\"off\"\n  Usage:\n    <input class=\"espana-tarjeta-sanitaria-individual-input\" type=\"text\" aria-label=\"TSI\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"espana-tarjeta-sanitaria-individual-input\"\n  type=\"text\"\n  aria-label=\"\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Espana Tarjeta Sanitaria Individual Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
