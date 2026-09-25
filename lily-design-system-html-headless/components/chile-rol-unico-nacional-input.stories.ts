import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="chile-rol-unico-nacional-input"
  type="text"
  aria-label="Rol Único Nacional (RUN)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/ChileRolUnicoNacionalInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
