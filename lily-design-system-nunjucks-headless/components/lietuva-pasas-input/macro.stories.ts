import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="lietuva-pasas-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Lithuanian Passport">`;

const meta = {
  title: 'Headless/LietuvaPasasInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
