import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="lietuva-pasas-input"
  type="text"
  aria-label="Lithuanian Passport"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/LietuvaPasasInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
