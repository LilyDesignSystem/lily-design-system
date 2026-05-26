import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="portugal-numero-de-identificacao-fiscal-view"
  aria-label="Tax Identification Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/PortugalNumeroDeIdentificacaoFiscalView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
