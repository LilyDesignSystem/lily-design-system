import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="espana-codigo-de-identificacion-fiscal-input"
  type="text"
  aria-label="Tax Identification Code"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/EspanaCodigoDeIdentificacionFiscalInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
