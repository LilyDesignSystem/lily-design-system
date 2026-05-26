import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="portugal-numero-de-identificacao-fiscal-input"
  type="text"
  aria-label="Tax Identification Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/PortugalNumeroDeIdentificacaoFiscalInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
