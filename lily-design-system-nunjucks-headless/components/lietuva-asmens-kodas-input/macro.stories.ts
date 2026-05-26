import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="lietuva-asmens-kodas-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Personal Code">`;

const meta = {
  title: 'Headless/LietuvaAsmensKodasInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
