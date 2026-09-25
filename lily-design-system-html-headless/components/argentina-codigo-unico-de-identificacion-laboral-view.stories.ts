import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="argentina-codigo-unico-de-identificacion-laboral-view"
  aria-label="Código Único de Identificación Laboral (CUIL)"
>sample-value</span>`;

const meta = {
  title: 'Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
