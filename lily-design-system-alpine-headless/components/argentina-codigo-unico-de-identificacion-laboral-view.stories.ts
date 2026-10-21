import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"argentina-codigo-unico-de-identificacion-laboral-view\"\n  aria-label=\"Código Único de Identificación Laboral (CUIL)\"\n></span>";

const meta = {
  title: 'Headless/Argentina Codigo Unico De Identificacion Laboral View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
