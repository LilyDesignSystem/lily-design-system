import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EspanaCodigoDeIdentificacionFiscalInput component -->\n<!--\n  Description: an input for entering Spain's Código de Identificación Fiscal (CIF)\n  HTML tag: <input>\n  CSS class: espana-codigo-de-identificacion-fiscal-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)\n  Usage:\n    <input class=\"espana-codigo-de-identificacion-fiscal-input\" type=\"text\" aria-label=\"Tax Identification Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"espana-codigo-de-identificacion-fiscal-input\"\n  type=\"text\"\n  aria-label=\"Tax Identification Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Espana Codigo De Identificacion Fiscal Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
