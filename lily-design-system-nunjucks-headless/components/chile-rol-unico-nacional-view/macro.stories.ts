import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="chile-rol-unico-nacional-view"
  aria-label="Rol Único Nacional (RUN)">sample-value</span>`;

const meta = {
  title: 'Headless/ChileRolUnicoNacionalView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
