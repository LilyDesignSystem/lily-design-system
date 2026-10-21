import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PortugalNumeroDeIdentificacaoFiscalView component -->\n<!--\n  Description: a read-only display of Portugal's Número de Identificação Fiscal (NIF)\n  HTML tag: <span>\n  CSS class: portugal-numero-de-identificacao-fiscal-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.)\n  Usage:\n    <span class=\"portugal-numero-de-identificacao-fiscal-view\" aria-label=\"Tax Identification Number\">value-here</span>\n-->\n\n<span\n  class=\"portugal-numero-de-identificacao-fiscal-view\"\n  aria-label=\"Tax Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Portugal Numero De Identificacao Fiscal View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
