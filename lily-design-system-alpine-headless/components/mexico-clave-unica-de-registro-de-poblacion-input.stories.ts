import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"mexico-clave-unica-de-registro-de-poblacion-input\"\n  type=\"text\"\n  aria-label=\"Clave Única de Registro de Población (CURP)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Mexico Clave Unica De Registro De Poblacion Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
