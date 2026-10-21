import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EspanaCodigoDeIdentificacionFiscalView component -->\n<!--\n  Description: a read-only display of Spain's Código de Identificación Fiscal (CIF)\n  HTML tag: <span>\n  CSS class: espana-codigo-de-identificacion-fiscal-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)\n  Usage:\n    <span class=\"espana-codigo-de-identificacion-fiscal-view\" aria-label=\"Tax Identification Code\">value-here</span>\n-->\n\n<span\n  class=\"espana-codigo-de-identificacion-fiscal-view\"\n  aria-label=\"Tax Identification Code\"\n></span>";

const meta = {
  title: 'Headless/Espana Codigo De Identificacion Fiscal View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
