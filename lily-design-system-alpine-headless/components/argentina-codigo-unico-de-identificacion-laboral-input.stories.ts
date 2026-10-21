import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"argentina-codigo-unico-de-identificacion-laboral-input\"\n  type=\"text\"\n  aria-label=\"Código Único de Identificación Laboral (CUIL)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Argentina Codigo Unico De Identificacion Laboral Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
