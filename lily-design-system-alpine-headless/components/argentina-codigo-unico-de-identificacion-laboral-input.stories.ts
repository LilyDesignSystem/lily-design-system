import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ArgentinaCodigoUnicoDeIdentificacionLaboralInput component -->\n<!--\n  Description: an input for entering Argentina's Codigo Unico de Identificacion Laboral (CUIL)\n  HTML tag: <input>\n  CSS class: argentina-codigo-unico-de-identificacion-laboral-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: XX-NNNNNNNN-X: prefix, 8-digit DNI, Modulus-11 check digit.\n  Usage:\n    <input class=\"argentina-codigo-unico-de-identificacion-laboral-input\" type=\"text\" aria-label=\"Código Único de Identificación Laboral (CUIL)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"argentina-codigo-unico-de-identificacion-laboral-input\"\n  type=\"text\"\n  aria-label=\"Código Único de Identificación Laboral (CUIL)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Argentina Codigo Unico De Identificacion Laboral Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
