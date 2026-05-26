import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="espana-codigo-de-identificacion-fiscal-view"
  aria-label="Tax Identification Code"
>sample-value</span>`;

const meta = {
  title: 'Headless/EspanaCodigoDeIdentificacionFiscalView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
