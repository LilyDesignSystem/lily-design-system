import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="mexico-clave-unica-de-registro-de-poblacion-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Mexico's Clave Única de Registro de Población (CURP)">`;

const meta = {
  title: 'Headless/MexicoClaveUnicaDeRegistroDePoblacionInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
