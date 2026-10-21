import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PortugalNumeroDeIdentificacaoFiscalInput component -->\n<!--\n  Description: an input for entering Portugal's Número de Identificação Fiscal (NIF)\n  HTML tag: <input>\n  CSS class: portugal-numero-de-identificacao-fiscal-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.)\n  Usage:\n    <input class=\"portugal-numero-de-identificacao-fiscal-input\" type=\"text\" aria-label=\"Tax Identification Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"portugal-numero-de-identificacao-fiscal-input\"\n  type=\"text\"\n  aria-label=\"Tax Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Portugal Numero De Identificacao Fiscal Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
