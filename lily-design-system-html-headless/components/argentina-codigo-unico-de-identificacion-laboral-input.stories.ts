import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="argentina-codigo-unico-de-identificacion-laboral-input"
  type="text"
  aria-label="Código Único de Identificación Laboral (CUIL)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
