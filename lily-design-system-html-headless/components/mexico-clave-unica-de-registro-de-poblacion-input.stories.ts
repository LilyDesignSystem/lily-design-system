import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="mexico-clave-unica-de-registro-de-poblacion-input"
  type="text"
  aria-label="Clave Única de Registro de Población (CURP)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/MexicoClaveUnicaDeRegistroDePoblacionInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
