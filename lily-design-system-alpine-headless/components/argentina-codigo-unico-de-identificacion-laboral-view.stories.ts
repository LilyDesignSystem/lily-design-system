import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ArgentinaCodigoUnicoDeIdentificacionLaboralView component -->\n<!--\n  Description: a read-only display of Argentina's Codigo Unico de Identificacion Laboral (CUIL)\n  HTML tag: <span>\n  CSS class: argentina-codigo-unico-de-identificacion-laboral-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: XX-NNNNNNNN-X: prefix, 8-digit DNI, Modulus-11 check digit.\n  Usage:\n    <span class=\"argentina-codigo-unico-de-identificacion-laboral-view\" aria-label=\"Código Único de Identificación Laboral (CUIL)\">value-here</span>\n-->\n\n<span\n  class=\"argentina-codigo-unico-de-identificacion-laboral-view\"\n  aria-label=\"Código Único de Identificación Laboral (CUIL)\"\n></span>";

const meta = {
  title: 'Headless/Argentina Codigo Unico De Identificacion Laboral View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
