import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="mexico-clave-unica-de-registro-de-poblacion-view"
  aria-label="Clave Única de Registro de Población (CURP)"
>sample-value</span>`;

const meta = {
  title: 'Headless/MexicoClaveUnicaDeRegistroDePoblacionView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
